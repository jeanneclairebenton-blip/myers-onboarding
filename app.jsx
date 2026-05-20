// app.jsx — root with state + routing
(function() {
const { useState, useEffect } = React;
const { Icon, Confetti, Modal, ProgressBar, Pill, SectionHead, Contact, Check } = window;
const { Wizard, TeamPage, SyncToDriveModal } = window;
const { WelcomePostPicker, EmailSigBuilder, BusinessCardsBuilder, CarrotSiteBuilder, SocialKit } = window;
const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton, TweakSelect, useTweaks } = window;
const { Cat } = window;
const PHASES = window.MYERS_DATA.PHASES;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "gold",
  "density": "regular",
  "framing": "business",
  "showMarketing": true,
  "style": "editorial"
}/*EDITMODE-END*/;

const DEFAULT_AGENT = {
  first: 'Alex',
  last: 'Rivera',
  fullName: 'Alex Rivera',
  title: 'Investment Specialist',
  phone: '(214) 555-0119',
  email: 'alex@myershomebuyers.com',
  license: '0789421',
};

const STORAGE_KEY = 'myers-onboarding-v2';

// ── Google Sheets + Drive Sync ─────────────────────────────────────────────
// Replace this URL with your deployed Apps Script web app URL.
// Setup: Google Sheet → Extensions → Apps Script → paste the doPost function
// → Deploy → New deployment → Web app → Anyone → Copy URL here.
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzDquRtva4ZHShdm8TDiNpbbnP5GEDQbQ8wmktlhtzstWhxDQuyWpGvwq3V7F3F6S0p/exec';

// Milestone definitions — maps phase IDs to readable milestone names
const MILESTONES = {
  'profile':  'Profile Complete',
  'paperwork':'Paperwork Signed',
  'licensing':'License Transferred',
  'tools':    'Tech Setup Complete',
  'brand':    'Brand Kit Ready',
  'closing':  'Launch Ready 🚀',
};

// Track which milestones we've already sent (so we don't double-send)
const _sentMilestones = {};

function syncMilestone(phaseId, agent, progress, extras) {
  if (!SHEET_URL) return;
  if (_sentMilestones[phaseId + '-' + (agent.fullName||'')]) return; // already sent
  _sentMilestones[phaseId + '-' + (agent.fullName||'')] = true;

  const payload = {
    type: 'milestone',
    milestone: MILESTONES[phaseId] || phaseId,
    phaseId: phaseId,
    fullName: agent.fullName || '',
    first: agent.first || '',
    last: agent.last || '',
    email: agent.email || '',
    phone: agent.phone || '',
    title: agent.title || '',
    license: agent.license || '',
    progress: progress,
    timestamp: new Date().toISOString(),
  };

  // Attach photo as base64 if available (for Drive upload)
  if (extras?.photo) payload.photo = extras.photo;
  // Attach welcome template image if available
  if (extras?.welcomeTemplate) payload.welcomeTemplate = extras.welcomeTemplate;
  if (extras?.welcomeTemplateName) payload.welcomeTemplateName = extras.welcomeTemplateName;

  try {
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) { console.warn('Milestone sync failed:', e); }
}

// Check if a milestone was just hit (all required tasks in a phase done)
function checkMilestones(progress, agent) {
  const PHASES = window.MYERS_DATA.PHASES;
  PHASES.forEach(phase => {
    const required = phase.tasks.filter(t => !t.optional);
    const allDone = required.every(t => progress[t.id]);
    if (allDone) {
      const extras = {};
      if (phase.id === 'profile' && agent.photo) extras.photo = agent.photo;
      syncMilestone(phase.id, agent, progress, extras);
    }
  });
}

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
        checkMilestones(next, s.agent);
      }
      return { ...s, progress: next };
    });
  };

  const markTaskDone = (taskId) => {
    setState(s => {
      if (s.progress[taskId]) return s;
      setConfetti(c => c + 1);
      const next = { ...s.progress, [taskId]: true };
      checkMilestones(next, s.agent);
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
      <Topbar agent={state.agent} route={route} goTo={guardedSetRoute} style={t.style || 'editorial'} setStyle={(v) => setTweak('style', v)} />

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
      <Modal open={marketing === 'cards'} onClose={() => setMarketing(null)}>
        <BusinessCardsBuilder agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'website'} onClose={() => setMarketing(null)}>
        <CarrotSiteBuilder agent={state.agent} onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={marketing === 'social'} onClose={() => setMarketing(null)} maxWidth={780}>
        <SocialKit onClose={() => setMarketing(null)} />
      </Modal>
      <Modal open={showSync} onClose={() => setShowSync(false)} maxWidth={880}>
        <SyncToDriveModal agent={state.agent} progress={state.progress} onClose={() => setShowSync(false)} onSubmitted={() => { setSyncSubmitted(true); setTimeout(() => setRoute({ view: 'team' }), 1700); }} />
      </Modal>

      <TweaksPanel>
        <TweakSection label="2026 Style Mode" />
        <TweakSelect label="Style" value={t.style}
          options={['editorial', 'bento', 'glass', 'dark', 'sentient', 'layered']}
          onChange={(v) => setTweak('style', v)} />
        <TweakSection label="Brand palette" />
        <TweakRadio label="Accent" value={t.palette}
          options={['gold', 'ember', 'sage', 'slate']}
          onChange={(v) => setTweak('palette', v)} />
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

function Topbar({ agent, route, goTo, style, setStyle }) {
  const STYLES = [
    { id: 'editorial', name: 'Editorial' },
    { id: 'bento', name: 'Bento' },
    { id: 'glass', name: 'Glass' },
    { id: 'dark', name: 'Dark Studio' },
    { id: 'sentient', name: 'Sentient' },
    { id: 'layered', name: 'Bento 2.0' },
  ];
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand" onClick={() => goTo({ view: 'dashboard' })} style={{ cursor: 'pointer' }}>
          <div className="brand-mark">M</div>
          Myers
          <div className="brand-sub">Agent Onboarding</div>
        </div>
        <div className="topbar-spacer" />
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
    <footer style={{ marginTop: 64, borderTop: '1px solid var(--hairline)', background: 'var(--ink)', color: 'var(--cream)' }}>
      <div className="container" style={{ padding: '64px 32px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, marginBottom: 12 }}>
              Myers <em style={{ color: 'var(--cream-deep)' }}>Home Buyers</em>
            </div>
            <div style={{ fontSize: 13, color: 'var(--cream-deep)', maxWidth: 320, lineHeight: 1.6 }}>
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
            <a href="#">Brand kit</a>
            <a href="#">Carrot.com</a>
            <a href="#">Marketing Drive</a>
          </FooterCol>
        </div>
        <div style={{ marginTop: 56, paddingTop: 24, borderTop: '1px solid rgba(251,232,183,.15)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--cream-deep)' }}>
          <span>© 2026 Myers Home Buyers · Where Agents Become Investors</span>
          <span><a href="#" onClick={(e) => { e.preventDefault(); resetProgress(); }} style={{ color: 'var(--cream-deep)' }}>Reset progress</a></span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <div className="kicker" style={{ color: 'var(--cream-deep)', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
        {React.Children.map(children, (child, i) => (
          <span key={i} style={{ color: 'var(--cream)', opacity: .85 }}>{child}</span>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
