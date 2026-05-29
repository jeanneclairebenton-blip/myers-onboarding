// app.jsx — root with state + routing
(function() {
const { useState, useEffect } = React;
const { Icon, Confetti, Modal, ProgressBar, Pill, SectionHead, Contact, Check } = window;
const { Wizard, TeamPage, SyncToDriveModal } = window;
const { WelcomePostPicker, EmailSigBuilder, BusinessCardsBuilder, CarrotSiteBuilder, SocialKit, PayoutModal } = window;
const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton, TweakSelect, useTweaks } = window;
const { Cat } = window;
const PHASES = window.MYERS_DATA.PHASES;

window.GOOGLE_SHEETS_WEBHOOK_URL = ''; // Paste your Apps Script Web App URL here

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "gold",
  "density": "regular",
  "framing": "business",
  "showMarketing": true,
  "style": "editorial"
}/*EDITMODE-END*/;

const MILESTONES = {
  'profile':  'Profile Complete',
  'paperwork':'Paperwork Signed',
  'licensing':'License Transferred',
  'tools':    'Tech Setup Complete',
  'comms':    'Safety & Comms Ready',
  'brand':    'Brand Kit Ready',
  'closing':  'Launch Ready 🚀',
};

const DEFAULT_AGENT = {
  first: 'Alex',
  last: 'Rivera',
  fullName: 'Alex Rivera',
  title: '',
  phone: '(214) 555-0119',
  email: 'alex@myershomebuyers.com',
  license: '0789421',
};

const STORAGE_KEY = 'myers-onboarding-v2';

// ── Google Sheets Sync ──────────────────────────────────────────────────────
// Replace this URL with your deployed Apps Script web app URL.
// See SETUP_INSTRUCTIONS.md for step-by-step guide.
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzVhSsHpwwdYyUTrgbi5oTsaKhG6GUlwTIKoIiJVTThHF2chQUiXkqhKfFQ0nZ2Xv1cWQ/exec';

// Track which syncs are in-flight to avoid duplicates
const _syncQueue = {};

// Sync a single task completion to both sheets
function syncTask(taskId, completed, agent, allProgress) {
  if (!SHEET_URL || SHEET_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    console.warn('Sheet URL not configured — skipping sync. See SETUP_INSTRUCTIONS.md');
    return;
  }
  const queueKey = taskId + '-' + (agent.email || '');
  if (_syncQueue[queueKey]) return;
  _syncQueue[queueKey] = true;

  const payload = {
    type: 'task',
    taskId: taskId,
    completed: completed,
    agent: {
      fullName: agent.fullName || '',
      first: agent.first || '',
      last: agent.last || '',
      email: agent.email || '',
      phone: agent.phone || '',
      title: agent.title || '',
      license: agent.license || '',
    },
    allProgress: allProgress,
    timestamp: new Date().toISOString(),
  };

  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) console.log('✓ Synced task:', taskId);
    else console.warn('Sync error:', data.error);
  })
  .catch(e => console.warn('Sync failed:', e))
  .finally(() => { delete _syncQueue[queueKey]; });
}

// Sync agent profile info (creates row if new agent)
function syncProfile(agent, allProgress) {
  if (!SHEET_URL || SHEET_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') return;

  const payload = {
    type: 'profile',
    agent: {
      fullName: agent.fullName || '',
      first: agent.first || '',
      last: agent.last || '',
      email: agent.email || '',
      phone: agent.phone || '',
      title: agent.title || '',
      license: agent.license || '',
    },
    allProgress: allProgress,
    timestamp: new Date().toISOString(),
  };

  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) console.log('✓ Profile synced');
    else console.warn('Profile sync error:', data.error);
  })
  .catch(e => console.warn('Profile sync failed:', e));
}

// Full sync — sends all progress + photos + marketing at once (used by Submit button)
function syncFull(agent, allProgress) {
  if (!SHEET_URL || SHEET_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    return Promise.reject(new Error('Sheet URL not configured'));
  }

  const payload = {
    type: 'full',
    agent: {
      fullName: agent.fullName || '',
      first: agent.first || '',
      last: agent.last || '',
      email: agent.email || '',
      phone: agent.phone || '',
      title: agent.title || '',
      license: agent.license || '',
    },
    allProgress: allProgress,
    // Include headshot photo (base64) for Drive upload
    photo: agent.photo || null,
    // Include marketing selections
    marketing: {
      welcomeTemplate: agent.welcomeTemplate || null,
      cardStyle: agent.cardStyle || null,
      welcomeImage: agent.welcomeImage || null,
    },
    timestamp: new Date().toISOString(),
  };

  return fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })
  .then(r => r.json());
}

// Make syncFull available to other components (SyncToDriveModal)
window._myersSyncFull = syncFull;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { progress: {}, agent: DEFAULT_AGENT };
}

function App() {
  const [route, setRoute] = useState({ view: 'dashboard' });
  const [state, setState] = useState(loadState);
  const [marketing, setMarketing] = useState(null);
  const [showSync, setShowSync] = useState(false);
  const [syncSubmitted, setSyncSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state]);

  // Apply tweaks to root
  useEffect(() => {
    document.body.dataset.density = t.density || 'regular';
    document.body.dataset.style = t.style || 'editorial';
    const palettes = {
      gold:  { gold: '#C9941F', goldDeep: '#8B6B1A', cream: '#FBE8B7', creamSoft: '#FDF1D0', creamDeep: '#F5D782' },
      ember: { gold: '#B0432A', goldDeep: '#7A2F1C', cream: '#F3D6CC', creamSoft: '#FBEAE3', creamDeep: '#E6B2A1' },
      sage:  { gold: '#4F7A3A', goldDeep: '#365327', cream: '#D9E5C9', creamSoft: '#EAF1DD', creamDeep: '#BFD2A4' },
      slate: { gold: '#2E5C8A', goldDeep: '#1F3F61', cream: '#D5E2F0', creamSoft: '#E6EFF7', creamDeep: '#A8C2DC' },
    };
    const p = palettes[t.palette] || palettes.gold;
    const root = document.documentElement;
    root.style.setProperty('--gold', p.gold);
    root.style.setProperty('--gold-deep', p.goldDeep);
    root.style.setProperty('--cream', p.cream);
    root.style.setProperty('--cream-soft', p.creamSoft);
    root.style.setProperty('--cream-deep', p.creamDeep);
  }, [t.palette, t.density, t.style]);

  const toggleTask = (taskId) => {
    setState(s => {
      const wasOn = !!s.progress[taskId];
      const next = { ...s.progress, [taskId]: !wasOn };
      if (!wasOn) {
        setConfetti(c => c + 1);
      }
      // Sync task to Google Sheet
      syncTask(taskId, !wasOn, s.agent, next);
      // If profile was just confirmed, also sync profile info
      if (taskId === 'profile-done' && !wasOn) {
        syncProfile(s.agent, next);
      }
      return { ...s, progress: next };
    });
  };

  const markTaskDone = (taskId) => {
    setState(s => {
      if (s.progress[taskId]) return s;
      setConfetti(c => c + 1);
      const next = { ...s.progress, [taskId]: true };
      // Sync task to Google Sheet
      syncTask(taskId, true, s.agent, next);
      if (taskId === 'profile-done') {
        syncProfile(s.agent, next);
      }
      return { ...s, progress: next };
    });
  };

  // Open a marketing modal AND mark its task done (welcome-post waits for download via postMessage)
  const openMarketing = (action) => {
    setMarketing(action);
    const autoCompleteMap = {
      'cards': 'cards',
      'website': 'website',
      'social': 'social-kit',
    };
    if (autoCompleteMap[action]) markTaskDone(autoCompleteMap[action]);
  };

  // Block Team route unless sync has been submitted (only when all tasks complete)
  const guardedSetRoute = (next) => {
    if (next.view === 'team' && !syncSubmitted) {
      setShowSync(true);
      return;
    }
    setRoute(next);
  };
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === 'myers-task-done' && e.data.taskId) {
        markTaskDone(e.data.taskId);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const updateAgent = (patch) => {
    setState(s => {
      const next = { ...s.agent, ...patch };
      if (patch.first || patch.last) {
        next.fullName = (patch.first || s.agent.first) + ' ' + (patch.last || s.agent.last);
      }
      return { ...s, agent: next };
    });
  };

  const resetProgress = () => {
    if (confirm('Reset all progress?')) {
      setState({ progress: {}, agent: DEFAULT_AGENT });
      setRoute({ view: 'dashboard' });
    }
  };

  return (
    <div className="app-root">
      <Topbar agent={state.agent} route={route} goTo={guardedSetRoute} style={t.style || 'editorial'} setStyle={(v) => setTweak('style', v)} resetProgress={resetProgress} />

      <main>
        {route.view === 'dashboard' && (
          <Wizard
            progress={state.progress}
            agent={state.agent}
            goTo={guardedSetRoute}
            toggleTask={toggleTask}
            openMarketing={openMarketing}
            updateAgent={updateAgent}
            openSync={() => setShowSync(true)}
            syncSubmitted={syncSubmitted}
          />
        )}
        {route.view === 'team' && (
          <TeamPage goTo={setRoute} />
        )}
      </main>

      <Footer goTo={setRoute} resetProgress={resetProgress} />

      <Confetti trigger={confetti} />

      <Cat progress={state.progress} />

      {/* Marketing modals */}
      <Modal open={marketing === 'welcome-post'} onClose={() => setMarketing(null)}>
        <WelcomePostPicker agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'email-sig'} onClose={() => setMarketing(null)}>
        <EmailSigBuilder agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'cards'} onClose={() => setMarketing(null)}>
        <BusinessCardsBuilder agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'website'} onClose={() => setMarketing(null)}>
        <CarrotSiteBuilder agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'social'} onClose={() => setMarketing(null)} maxWidth={780}>
        <SocialKit agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'payout-process'} onClose={() => setMarketing(null)}>
        <PayoutModal onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={showSync} onClose={() => setShowSync(false)} maxWidth={880}>
        <SyncToDriveModal agent={state.agent} progress={state.progress} onClose={() => setShowSync(false)} onSubmitted={() => { setSyncSubmitted(true); setTimeout(() => setRoute({ view: 'team' }), 1700); }} />
      </Modal>

      <TweaksPanel>
        <TweakSection label="2026 Style Mode" />
        <TweakSelect label="Style" value={t.style}
          options={['editorial', 'dark']}
          onChange={(v) => setTweak('style', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Content" />
        <TweakToggle label="Show marketing pack" value={t.showMarketing}
          onChange={(v) => setTweak('showMarketing', v)} />
        <TweakSection label="State" />
        <TweakButton label="Reset progress" onClick={resetProgress} />
      </TweaksPanel>
    </div>
  );
}

function Topbar({ agent, route, goTo, style, setStyle, resetProgress }) {
  const STYLES = [
    { id: 'editorial', name: 'Light' },
    { id: 'dark', name: 'Dark' },
  ];
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand" onClick={() => goTo({ view: 'dashboard' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={style === 'dark' ? 'assets/logo-white.png' : 'assets/logo-black.png'} alt="Myers Home Buyers" style={{ height: 32, objectFit: 'contain' }} />
          <div className="brand-sub" style={{ paddingLeft: 12, borderLeft: '1px solid var(--hairline)' }}>Agent Onboarding</div>
        </div>
        <div className="topbar-spacer" />
        <button onClick={resetProgress} style={{ marginRight: 16, background: 'var(--red)', color: 'white', padding: '6px 12px', borderRadius: 4, fontWeight: 'bold', fontSize: 12, border: 'none', cursor: 'pointer' }}>Start Over (Test)</button>
        <div className="style-switcher" title="Switch 2026 design style">
          <span className="style-switcher-label">Style</span>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <nav className="topbar-nav">
          <button className={route.view === 'dashboard' ? 'active' : ''} onClick={() => goTo({ view: 'dashboard' })}>Onboarding</button>
          <button className={route.view === 'team' ? 'active' : ''} onClick={() => goTo({ view: 'team' })}>Team</button>
        </nav>
        <div className="topbar-profile">
          <div className="avatar" style={agent.photo ? { backgroundImage: `url(${agent.photo})`, backgroundSize: 'cover', backgroundPosition: 'center 25%', color: 'transparent' } : null}>
            {!agent.photo && `${agent.first?.[0] || ''}${agent.last?.[0] || ''}`}
          </div>
          <div className="topbar-profile-name">{agent.fullName}</div>
        </div>
      </div>
    </header>
  );
}

function Footer({ goTo, resetProgress }) {
  return (
    <footer style={{ marginTop: 64, borderTop: '1px solid var(--hairline)', background: '#1A1815', color: '#FBE8B7' }}>
      <div className="container" style={{ padding: '64px 32px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, marginBottom: 12, color: '#FBE8B7' }}>
              Myers <em style={{ color: '#F5D782' }}>Home Buyers</em>
            </div>
            <div style={{ fontSize: 13, color: '#F5D782', maxWidth: 320, lineHeight: 1.6 }}>
              16479 N. Dallas Pkwy, Suite, Addison, TX 75001<br/>
              Brokerage License #9005311-BB
            </div>
          </div>
          <FooterCol title="Help">
            <a href="#" onClick={(e) => { e.preventDefault(); goTo({ view: 'team' }); }}>Meet the team</a>
            <a href="#">Slack #askmeanything2026</a>
            <a href="#">Text Jeanne — (337) 258-1093</a>
          </FooterCol>
          <FooterCol title="Tools">
            <a href="#">Zoho CRM</a>
            <a href="#">NTREIS / MLS</a>
            <a href="#">Zip Forms</a>
            <a href="#">ForeWarn</a>
          </FooterCol>
          <FooterCol title="Marketing">
            <a href="https://drive.google.com/drive/u/0/folders/11Wo44zwGzuZUL18kfltUjxN-DAuqtiPl" target="_blank" rel="noopener">Brand Guidelines</a>
            <a href="https://drive.google.com/drive/u/0/folders/11Wo44zwGzuZUL18kfltUjxN-DAuqtiPl" target="_blank" rel="noopener">Logos</a>
            <a href="#">Carrot.com</a>
            <a href="https://drive.google.com/drive/u/0/folders/11Wo44zwGzuZUL18kfltUjxN-DAuqtiPl" target="_blank" rel="noopener">Marketing Drive</a>
          </FooterCol>
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(251,232,183,.15)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#F5D782' }}>
          <span>© 2026 Myers Home Buyers · Where Agents Become Investors</span>
          <span><a href="#" onClick={(e) => { e.preventDefault(); resetProgress(); }} style={{ color: '#F5D782' }}>Reset progress</a></span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <div className="kicker" style={{ color: '#F5D782', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
        {React.Children.map(children, (child, i) => (
          <span key={i} style={{ color: '#FBE8B7', opacity: .85 }}>{child}</span>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
