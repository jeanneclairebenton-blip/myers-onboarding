// marketing.jsx — Welcome Post, Email Signature, Business Cards, Carrot site, Social kit
(function() {
const { useState } = React;
const { Icon } = window;
const { WELCOME_POSTS, BUSINESS_CARDS, SOCIAL_KIT } = window.MYERS_DATA;

// ── Welcome Post Picker — embeds the user's existing generator ──────────
function WelcomePostPicker({ agent, onClose }) {
  const markDone = () => {
    try {
      const raw = localStorage.getItem('myers-onboarding-v2');
      const ob = raw ? JSON.parse(raw) : { progress: {}, agent: {} };
      ob.progress = { ...(ob.progress || {}), 'welcome-post': true };
      localStorage.setItem('myers-onboarding-v2', JSON.stringify(ob));
      window.postMessage({ type: 'myers-task-done', taskId: 'welcome-post' }, '*');
    } catch (e) {}
    onClose();
  };
  return (
    <div style={{ padding: 0, minHeight: 540 }}>
      <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div className="kicker" style={{ marginBottom: 6 }}>Marketing · Welcome Announcement</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400 }}>Pick Your Template, Download, Post.</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, maxWidth: 540 }}>
            Your headshot, name, and title are pre-loaded from Step 1. Pick a template, tweak the text, hit Download PNG, then share to your channels.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
          <a href="welcome-generator.html" target="_blank" rel="noopener" className="btn ghost sm">
            Open Full Size <Icon.External />
          </a>
          <button className="btn gold sm" onClick={markDone}>
            <Icon.Check /> Mark Complete & Close
          </button>
        </div>
      </div>
      <iframe src="welcome-generator.html" className="gen-frame" title="Welcome generator" />
    </div>
  );
}

function PostCanvas({ post, agent }) {
  const SIZE = 420;
  const replaceName = (s) => s.replace('{NAME}', agent.first);
  return (
    <div style={{
      width: SIZE, height: SIZE,
      background: post.bg, color: post.fg,
      borderRadius: 8, overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 24px 60px rgba(0,0,0,.18)',
      fontFamily: 'var(--sans)',
    }}>
      <PostContent post={post} agent={agent} size={SIZE} />
    </div>
  );
}

function PostThumb({ post }) {
  return <PostContent post={post} agent={{ first: 'You' }} size={140} />;
}

function PostContent({ post, agent, size }) {
  const s = size / 420;
  const px = (n) => n * s + 'px';
  const replaceName = (str) => str.replace('{NAME}', agent.first);

  const Logo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: px(8), fontFamily: 'var(--serif)', fontSize: px(16), color: post.fg, opacity: .9 }}>
      <div style={{ width: px(20), height: px(20), background: post.accent, borderRadius: px(4), display: 'grid', placeItems: 'center', color: post.bg, fontSize: px(12), fontStyle: 'italic' }}>M</div>
      <span style={{ fontStyle: 'italic' }}>Myers</span>
    </div>
  );

  if (post.style === 'serif-large') {
    return (
      <div style={{ padding: px(40), height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Logo />
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: px(72), lineHeight: 0.92, color: post.fg, letterSpacing: '-0.02em' }}>
            New<br/><em style={{ color: post.accent }}>chapter.</em>
          </div>
          <div style={{ fontSize: px(15), marginTop: px(16), opacity: .85, maxWidth: px(280), lineHeight: 1.4 }}>
            {replaceName(post.sub)}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: px(10), letterSpacing: '.1em', textTransform: 'uppercase', opacity: .6 }}>
          @{agent.first.toLowerCase()} · Myers Home Buyers
        </div>
      </div>
    );
  }

  if (post.style === 'serif-mixed') {
    return (
      <div style={{ padding: px(40), height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Logo />
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: px(64), lineHeight: 1, color: post.fg }}>Big news.</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: px(28), color: post.accent, marginTop: px(10), maxWidth: px(300), lineHeight: 1.15 }}>
            {replaceName(post.sub)}
          </div>
        </div>
        <div style={{ borderTop: '1px solid ' + post.accent + '40', paddingTop: px(12), display: 'flex', justifyContent: 'space-between', fontSize: px(11), fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
          <span>{agent.first}</span><span>Myers Agent</span>
        </div>
      </div>
    );
  }

  if (post.style === 'photo-first') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #C9941F, #8B6B1A)', position: 'relative', display: 'grid', placeItems: 'center' }}>
          <div style={{ width: px(140), height: px(140), borderRadius: '50%', background: 'rgba(251,232,183,.3)', border: '2px solid ' + post.accent, display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontSize: px(48), color: '#FBE8B7' }}>
            {agent.first[0]}
          </div>
          <div style={{ position: 'absolute', top: px(20), left: px(20), fontFamily: 'var(--mono)', fontSize: px(10), color: '#FBE8B7', letterSpacing: '.14em', textTransform: 'uppercase' }}>Photo placeholder</div>
        </div>
        <div style={{ padding: px(32), background: post.bg }}>
          <Logo />
          <div style={{ fontFamily: 'var(--serif)', fontSize: px(36), color: post.fg, marginTop: px(16), lineHeight: 1.05 }}>
            Hello, I'm <em style={{ color: post.accent }}>{agent.first}</em>.
          </div>
          <div style={{ fontSize: px(13), color: post.fg, opacity: .75, marginTop: px(8) }}>
            {replaceName(post.sub)}
          </div>
        </div>
      </div>
    );
  }

  if (post.style === 'stamp') {
    return (
      <div style={{ padding: px(40), height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ position: 'absolute', top: px(32), right: px(32), width: px(110), height: px(110), border: '2px solid ' + post.accent, borderRadius: '50%', display: 'grid', placeItems: 'center', textAlign: 'center', transform: 'rotate(8deg)', fontFamily: 'var(--mono)', fontSize: px(9), letterSpacing: '.1em', textTransform: 'uppercase', color: post.accent, lineHeight: 1.4 }}>
          Myers<br/>· est ·<br/>DFW
        </div>
        <Logo />
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: px(52), lineHeight: 1, color: post.fg, maxWidth: px(300), letterSpacing: '-0.01em' }}>
            Now licensed under <em style={{ color: post.accent }}>Myers</em>.
          </div>
          <div style={{ fontSize: px(13), marginTop: px(16), color: post.fg, opacity: .75, maxWidth: px(280) }}>
            {replaceName(post.sub)}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: px(10), letterSpacing: '.12em', textTransform: 'uppercase', opacity: .55 }}>
          {agent.first} · License #{agent.license || '0000000'}
        </div>
      </div>
    );
  }

  if (post.style === 'quote') {
    return (
      <div style={{ padding: px(48), height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: px(140), color: post.accent, lineHeight: 0.6, position: 'absolute', top: px(50), left: px(36) }}>"</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: px(34), color: post.fg, lineHeight: 1.15, marginTop: px(60), maxWidth: px(320) }}>
          The best time to buy was yesterday.
        </div>
        <div style={{ width: px(40), height: px(2), background: post.accent, margin: px(20) + ' 0 ' + px(14) }} />
        <div style={{ fontSize: px(13), color: post.fg, opacity: .85, maxWidth: px(280) }}>
          I'm <strong>{agent.first}</strong>, and I just joined Myers to help you find tomorrow's deal.
        </div>
        <div style={{ position: 'absolute', bottom: px(36), left: px(48) }}><Logo /></div>
      </div>
    );
  }

  if (post.style === 'grid') {
    return (
      <div style={{ padding: px(40), height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: px(16) }}>
        <div style={{ background: post.accent, color: '#fff', padding: px(20), borderRadius: px(8), display: 'flex', alignItems: 'flex-end', fontFamily: 'var(--serif)', fontSize: px(40), lineHeight: 0.9 }}>
          Joined.
        </div>
        <div style={{ background: post.fg, color: post.bg, padding: px(20), borderRadius: px(8), display: 'flex', alignItems: 'flex-end', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: px(40), lineHeight: 0.9 }}>
          Myers.
        </div>
        <div style={{ background: 'var(--cream)', padding: px(20), borderRadius: px(8), display: 'flex', alignItems: 'flex-end', fontFamily: 'var(--serif)', fontSize: px(40), lineHeight: 0.9, color: post.fg }}>
          Today.
        </div>
        <div style={{ background: post.bg, border: '1px solid ' + post.accent + '40', padding: px(16), borderRadius: px(8), display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: px(11), color: post.fg, opacity: .75, lineHeight: 1.4 }}>
            New agent, same mission: investors, the right property, the right price.
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: px(9), textTransform: 'uppercase', letterSpacing: '.1em', color: post.accent }}>
            — {agent.first}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ── Email Signature Builder ───────────────────────────────────────────────
function EmailSigBuilder({ agent, onClose, onAgentChange }) {
  const [draft, setDraft] = useState({ ...agent });
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState('classic');

  const updateField = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAgentChange && onAgentChange(draft);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', minHeight: 540 }}>
      {/* Form */}
      <div style={{ padding: 40, borderRight: '1px solid var(--hairline)' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Marketing · Email Signature</div>
        <h2 className="h2" style={{ marginBottom: 12 }}>Build your signature.</h2>
        <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>
          Fill it in, watch it preview live, then copy-paste into Gmail → Settings → Signature.
        </p>
        <SigInput label="Full name" value={draft.fullName} onChange={v => updateField('fullName', v)} />
        <SigInput label="Title" value={draft.title} onChange={v => updateField('title', v)} />
        <SigInput label="Phone" value={draft.phone} onChange={v => updateField('phone', v)} />
        <SigInput label="Email" value={draft.email} onChange={v => updateField('email', v)} />
        <SigInput label="License #" value={draft.license} onChange={v => updateField('license', v)} />

        <div style={{ marginTop: 24 }}>
          <div className="kicker" style={{ marginBottom: 10 }}>Style</div>
          <div className="row" style={{ gap: 8 }}>
            {['classic', 'editorial', 'minimal'].map(s => (
              <button key={s} onClick={() => setStyle(s)} className={`btn sm ${style === s ? 'gold' : 'ghost'}`} style={{ textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Preview */}
      <div style={{ background: 'var(--bg-soft)', padding: 32 }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Gmail preview</div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebebeb', fontSize: 13, color: '#5f6368' }}>
            <div><strong style={{ color: '#202124' }}>To:</strong> client@example.com</div>
            <div><strong style={{ color: '#202124' }}>Subject:</strong> Re: 432 Maple Lane — offer details</div>
          </div>
          <div style={{ padding: 24, color: '#202124', fontSize: 14, lineHeight: 1.6 }}>
            <p>Hi Jordan,</p>
            <p style={{ margin: '12px 0' }}>
              Wanted to follow up on the property at 432 Maple. Comps support the number we discussed and I've got a clear path to close. Let me know if you'd like to talk through the financing options this afternoon.
            </p>
            <p>Best,<br/>{draft.first}</p>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #ebebeb' }}>
              <SignatureRender draft={draft} style={style} />
            </div>
          </div>
        </div>
        <div className="row mt-24" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn ghost" onClick={onClose}>Done</button>
          <button className="btn gold" onClick={handleCopy}>
            <Icon.Copy /> {copied ? 'Copied!' : 'Copy signature HTML'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SigInput({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      <input value={value || ''} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--sans)',
        border: '1px solid var(--hairline-strong)', borderRadius: 8, background: 'var(--surface)',
        color: 'var(--ink)', outline: 'none',
      }} onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--hairline-strong)'} />
    </div>
  );
}

function SignatureRender({ draft, style }) {
  if (style === 'classic') {
    return (
      <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif', fontSize: 13, color: '#1A1815' }}>
        <tbody><tr>
          <td style={{ paddingRight: 18, borderRight: '2px solid #C9941F', verticalAlign: 'top' }}>
            <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #FBE8B7, #C9941F)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1815' }}>
              {(draft.first || '').slice(0,1)}{(draft.last || '').slice(0,1)}
            </div>
          </td>
          <td style={{ paddingLeft: 18, verticalAlign: 'top' }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{draft.fullName}</div>
            <div style={{ color: '#7A7263', fontSize: 12 }}>{draft.title}</div>
            <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.7 }}>
              <div>m: {draft.phone}</div>
              <div>e: {draft.email}</div>
              <div style={{ color: '#7A7263' }}>License #{draft.license}</div>
            </div>
            <div style={{ marginTop: 10, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 14, color: '#8B6B1A' }}>Myers — Where Agents Become Investors</div>
          </td>
        </tr></tbody>
      </table>
    );
  }
  if (style === 'editorial') {
    return (
      <div style={{ fontFamily: 'Georgia, serif', color: '#1A1815' }}>
        <div style={{ fontSize: 22, lineHeight: 1.1 }}>{draft.fullName}</div>
        <div style={{ fontStyle: 'italic', color: '#8B6B1A', fontSize: 14, marginTop: 2 }}>{draft.title} · Myers</div>
        <div style={{ marginTop: 12, fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#3D362A', lineHeight: 1.7 }}>
          {draft.phone} &nbsp;·&nbsp; {draft.email} &nbsp;·&nbsp; #{draft.license}
        </div>
      </div>
    );
  }
  // minimal
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1A1815', fontSize: 13, lineHeight: 1.7 }}>
      <div><strong>{draft.fullName}</strong> — {draft.title}</div>
      <div style={{ color: '#7A7263' }}>{draft.phone} · {draft.email}</div>
      <div style={{ color: '#7A7263' }}>Myers · License #{draft.license}</div>
    </div>
  );
}

// ── Business Cards — embeds the full 6-layout card builder ────────────────
function BusinessCardsBuilder({ agent, onClose }) {
  const markDone = () => {
    try {
      const raw = localStorage.getItem('myers-onboarding-v2');
      const ob = raw ? JSON.parse(raw) : { progress: {}, agent: {} };
      ob.progress = { ...(ob.progress || {}), 'cards': true };
      // Store which card style was selected
      ob.agent = { ...(ob.agent || {}), cardStyle: 'custom' };
      localStorage.setItem('myers-onboarding-v2', JSON.stringify(ob));
      window.postMessage({ type: 'myers-task-done', taskId: 'cards' }, '*');
    } catch (e) {}
    onClose();
  };
  return (
    <div style={{ padding: 0, minHeight: 540 }}>
      <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div className="kicker" style={{ marginBottom: 6 }}>Marketing · Business Cards</div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400 }}>Design your cards.</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, maxWidth: 540 }}>
            Six premium layouts with your details auto-filled. Pick a layout, switch themes, click any text to edit, then print or download.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
          <a href={`business-cards.html?name=${encodeURIComponent(agent.fullName||'')}&title=${encodeURIComponent(agent.title||'')}&phone=${encodeURIComponent(agent.phone||'')}&email=${encodeURIComponent(agent.email||'')}`} target="_blank" rel="noopener" className="btn cream">
            Open Full Size <Icon.External />
          </a>
          <button className="btn gold sm" onClick={markDone}>
            <Icon.Check /> Mark Complete & Close
          </button>
        </div>
      </div>
      <iframe src={`business-cards.html?name=${encodeURIComponent(agent.fullName||'')}&title=${encodeURIComponent(agent.title||'')}&phone=${encodeURIComponent(agent.phone||'')}&email=${encodeURIComponent(agent.email||'')}`} className="gen-frame" title="Business Card Builder" />
    </div>
  );
}

// ── Carrot Website ────────────────────────────────────────────────────────
function CarrotSiteBuilder({ agent, onClose }) {
  const [step, setStep] = useState(0);
  const siteUrl = agent.first.toLowerCase() + '.myershomes.com';
  const primary = '#C9941F';

  const markDone = () => {
    try {
      const raw = localStorage.getItem('myers-onboarding-v2');
      const ob = raw ? JSON.parse(raw) : { progress: {}, agent: {} };
      ob.progress = { ...(ob.progress || {}), 'website': true };
      localStorage.setItem('myers-onboarding-v2', JSON.stringify(ob));
      window.postMessage({ type: 'myers-task-done', taskId: 'website' }, '*');
    } catch (e) {}
    onClose();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', minHeight: 540 }}>
      <div style={{ padding: 40, borderRight: '1px solid var(--hairline)' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Marketing · Your Website</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, background: '#FF6B35', borderRadius: 6, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>C</div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Carrot.com partnership</span>
        </div>
        <h2 className="h2" style={{ marginBottom: 12 }}>Launch your AI-Powered Site.</h2>
        <p className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
          Free for every Myers agent. We use Carrot.com&apos;s advanced AI to instantly generate high-converting landing pages tailored to your profile.
        </p>

        <div className="col" style={{ gap: 20 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--hairline)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon.Sparkle style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>AI-generated, high-converting landing pages</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon.Home style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Built-in IDX integration for lead capture</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Icon.Doc style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Automated SEO blog posts from the team feed</span>
            </div>
          </div>

          <div style={{ padding: 16, background: 'var(--bg-soft)', borderRadius: 10, fontSize: 13 }}>
            <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Profile details to be submitted
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="muted">Name</span><span style={{ fontWeight: 600 }}>{agent.fullName}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="muted">Email</span><span style={{ fontWeight: 600 }}>{agent.email}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted">Phone</span><span style={{ fontWeight: 600 }}>{agent.phone}</span>
            </div>
          </div>

          <button className="btn gold lg" onClick={() => {
            alert('Request sent to Jeanne! Your AI-powered site will be provisioned shortly.');
            markDone();
          }}>
            <Icon.Mail /> Send Request to Jeanne
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-soft)', padding: 32, display: 'flex', flexDirection: 'column' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Carrot.com · What you get</div>
        <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.15)', flex: 1 }}>
          <img src="assets/carrot-preview.png" alt="Carrot.com website preview" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
      </div>
    </div>
  );
}

function CarrotPagePreview({ agent, primary }) {
  return (
    <div style={{ fontFamily: 'var(--sans)', color: '#1A1815' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="assets/myers-logo.png" alt="Myers" style={{ height: 26, objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
          <span>Properties</span><span>Sell</span><span>About</span><span style={{ color: primary, fontWeight: 600 }}>Contact</span>
        </div>
      </div>
      <div style={{ padding: '40px 24px 24px', background: 'linear-gradient(180deg, #FBE8B7 0%, #fff 100%)', position: 'relative' }}>
        <img src="assets/myers-mark.png" alt="" style={{ position: 'absolute', right: 24, top: 24, width: 80, height: 80, objectFit: 'contain', opacity: 0.18 }} />
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: primary, marginBottom: 8 }}>Investment Real Estate · DFW</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 32, lineHeight: 1.05, marginBottom: 10, maxWidth: 400 }}>
          Find your next <em style={{ color: primary }}>acquisition</em>.
        </div>
        <div style={{ fontSize: 12, color: '#666', maxWidth: 320, marginBottom: 14 }}>
          Off-market deals, MLS listings, and exclusive opportunities across DFW — curated by {agent.first}.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: primary, color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>Browse properties</div>
          <div style={{ border: '1px solid #ccc', padding: '8px 14px', borderRadius: 6, fontSize: 12 }}>Book a call</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[1,2,3].map(i => (
          <div key={i}>
            <div style={{ aspectRatio: '4/3', background: '#e9e3d2', borderRadius: 6, marginBottom: 6 }} />
            <div style={{ fontSize: 11, fontWeight: 600 }}>${320 + i*80}K · {2+i} bed</div>
            <div style={{ fontSize: 10, color: '#999' }}>Plano · For investors</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', background: '#1a1a1a', color: '#FBE8B7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
        <img src="assets/myers-logo-white.png" alt="Myers" style={{ height: 22, objectFit: 'contain' }} />
        <div style={{ opacity: 0.7 }}>© Myers Home Buyers · License #9005311-BB</div>
      </div>
    </div>
  );
}

// ── Social brand kit ──────────────────────────────────────────────────────
function SocialKit({ agent, onClose }) {
  const driveLink = agent?.folderUrl || '#'; // Fallback if no folder URL exists yet

  return (
    <div style={{ padding: 48 }}>
      <div className="kicker" style={{ marginBottom: 12 }}>Marketing · Social Brand Kit</div>
      <h2 className="h2" style={{ marginBottom: 12 }}>Everything to stay on-brand.</h2>
      <p className="muted" style={{ fontSize: 14, marginBottom: 32, maxWidth: 560 }}>
        Logos, fonts, palette, story templates, listing flyers. Grab everything from your Google Drive folder.
      </p>

      <div className="row mt-16" style={{ gap: 8, marginBottom: 24 }}>
        <a href={driveLink} target="_blank" rel="noopener" className="btn gold">
          Open in Drive <Icon.External />
        </a>
      </div>

      <div className="grid-2">
        {SOCIAL_KIT.map(item => (
          <div key={item.id} className="card card-pad" style={{ display: 'flex', gap: 16 }}>
            <SocialKitIcon kind={item.kind} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>{item.desc}</div>
              <div className="tag-row">
                {item.files.map(f => <span key={f} className="pill" style={{ fontSize: 11 }}>{f}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="callout mt-24">
        <strong>Brand guideline:</strong> Always pair the gold (#F5B021) with cream (#FBE8B7) or ink (#1A1815). Avoid placing gold on white without the cream backdrop — contrast drops below AA.
      </div>
    </div>
  );
}

function SocialKitIcon({ kind }) {
  const SIZE = 56;
  if (kind === 'logo') return <div style={{ width: SIZE, height: SIZE, background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 10, display: 'grid', placeItems: 'center', flexShrink: 0, padding: 6 }}><img src="assets/myers-mark.png" alt="Myers" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
  if (kind === 'palette') return (
    <div style={{ width: SIZE, height: SIZE, borderRadius: 10, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', flexShrink: 0 }}>
      <div style={{ background: '#C9941F' }} /><div style={{ background: '#FBE8B7' }} />
      <div style={{ background: '#1A1815' }} /><div style={{ background: '#FAF7F0' }} />
    </div>
  );
  if (kind === 'font') return <div style={{ width: SIZE, height: SIZE, background: 'var(--cream)', color: 'var(--ink)', borderRadius: 10, display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontSize: 32, flexShrink: 0 }}>Aa</div>;
  if (kind === 'template') return (
    <div style={{ width: SIZE, height: SIZE, background: 'var(--bg-soft)', borderRadius: 10, padding: 8, flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
      <div style={{ background: 'var(--gold)', borderRadius: 3 }} />
      <div style={{ background: 'var(--cream)', borderRadius: 3 }} />
      <div style={{ background: 'var(--cream-deep)', borderRadius: 3 }} />
      <div style={{ background: 'var(--ink)', borderRadius: 3 }} />
    </div>
  );
  return null;
}

function PayoutModal({ onClose }) {
  const markDone = () => {
    try {
      const raw = localStorage.getItem('myers-onboarding-v2');
      const ob = raw ? JSON.parse(raw) : { progress: {}, agent: {} };
      ob.progress = { ...(ob.progress || {}), 'payout-review': true };
      localStorage.setItem('myers-onboarding-v2', JSON.stringify(ob));
      window.postMessage({ type: 'myers-task-done', taskId: 'payout-review' }, '*');
    } catch (e) {}
    onClose();
  };

  return (
    <div style={{ padding: 40, maxWidth: 640, margin: '0 auto' }}>
      <div className="kicker" style={{ marginBottom: 12 }}>Finance & Operations</div>
      <h2 className="h2" style={{ marginBottom: 24 }}>Myers Payout Process</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
        
        <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(201, 148, 31, 0.15)', color: 'var(--gold)', display: 'grid', placeItems: 'center' }}>
              <Icon.Money style={{ width: 16, height: 16 }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Normal Commission Payouts</h3>
          </div>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Commissions are paid out twice a month: on the <strong>15th</strong> and the <strong>last day of the month</strong>. 
          </p>
          <div style={{ padding: 12, background: 'var(--bg-soft)', borderRadius: 8, fontSize: 13, borderLeft: '3px solid var(--gold)' }}>
            <strong>Important rule:</strong> A transaction must successfully close and fund <em>at least 2 days prior</em> to the payout date to be included in that check.
          </div>
        </div>

        <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(40, 200, 64, 0.15)', color: 'var(--green)', display: 'grid', placeItems: 'center' }}>
              <Icon.Zap style={{ width: 16, height: 16 }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Expedited Payout Option</h3>
          </div>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            Need your funds faster? You can request to receive your payment the same day or sooner. 
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 14, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>
            <li>There is a <strong>1% fee</strong> for expedited payouts.</li>
            <li>The minimum fee is <strong>$50</strong>.</li>
          </ul>
          <p style={{ fontSize: 13, fontWeight: 500 }}>
            To request: Contact Michael DeMott at <a href="mailto:mdemott@trelly.com" style={{ color: 'var(--gold)' }}>mdemott@trelly.com</a> or text (972) 849-7495.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--hairline)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(107, 78, 142, 0.15)', color: '#6B4E8E', display: 'grid', placeItems: 'center' }}>
              <Icon.Calendar style={{ width: 16, height: 16 }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Rev Share Payouts</h3>
          </div>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
            Rev Share Commissions are paid out strictly on the <strong>last day of each month</strong>. Please note that there is <em>no</em> expedited payout option available for Rev Share commissions.
          </p>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--hairline)', paddingTop: 24 }}>
        <button className="btn gold lg" onClick={markDone}>
          <Icon.Check /> I Acknowledge & Understand
        </button>
      </div>

    </div>
  );
}

Object.assign(window, {
  WelcomePostPicker, EmailSigBuilder, BusinessCardsBuilder, CarrotSiteBuilder, SocialKit, PayoutModal
});
})();
