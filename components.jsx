// components.jsx — Shared UI primitives for Myers Onboarding
(function() {
const { useState, useEffect, useRef } = React;

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = {
  Badge: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-2 5 2-1 2 1-2-5"/><circle cx="12" cy="9" r="6"/></svg>,
  Group: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Home: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Key: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Mail: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Folder: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Chat: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Zap: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Doc: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Calendar: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Money: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Signature: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Receipt: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg>,
  CreditCard: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Arrow: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  External: (p) => <svg {...p} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Lock: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Upload: (p) => <svg {...p} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Download: (p) => <svg {...p} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Copy: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Sparkle: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>,
  Phone: (p) => <svg {...p} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
};

// ── Check / checkbox ───────────────────────────────────────────────────────
function Check({ checked, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`check ${checked ? 'checked' : ''}`}
      aria-label={checked ? 'Completed' : 'Mark complete'}
      style={{
        width: 22, height: 22, borderRadius: 6,
        border: checked ? '2px solid var(--gold)' : '2px solid var(--hairline-strong)',
        background: checked ? 'var(--gold)' : 'transparent',
        display: 'grid', placeItems: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 200ms ease',
      }}
    >
      {checked && <Icon.Check style={{ width: 12, height: 12, color: '#fff' }} />}
    </button>
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────
function ProgressBar({ value, max, accent = 'var(--gold)' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ width: '100%', height: 6, background: 'var(--hairline)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 4, transition: 'width 400ms ease' }} />
    </div>
  );
}

// ── Pill / tag ─────────────────────────────────────────────────────────────
function Pill({ children, accent = 'var(--gold)' }) {
  return (
    <span className="pill" style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px', fontSize: 11, fontWeight: 600,
      background: `${accent}18`, color: accent,
      borderRadius: 4, letterSpacing: '.03em',
    }}>
      {children}
    </span>
  );
}

// ── Section heading ────────────────────────────────────────────────────────
function SectionHead({ kicker, title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {kicker && <div className="kicker" style={{ marginBottom: 8 }}>{kicker}</div>}
      <h2 className="h2">{title}</h2>
      {sub && <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

// ── Contact row ────────────────────────────────────────────────────────────
function Contact({ icon, label, value, href }) {
  const IconComp = icon;
  return (
    <a href={href} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', borderRadius: 8,
      transition: 'background 120ms',
    }}>
      <span style={{ color: 'var(--muted)' }}>{typeof icon === 'function' ? <IconComp /> : icon}</span>
      <div>
        <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
      </div>
    </a>
  );
}

// ── Confetti burst ─────────────────────────────────────────────────────────
function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger === 0) return;
    const colors = ['#C9941F', '#FBE8B7', '#8B6B1A', '#F5D782', '#E8842A', '#4F7A3A'];
    const newP = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + Math.random() * 10 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      speed: 2 + Math.random() * 4,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
    setParticles(newP);
    setTimeout(() => setParticles([]), 1500);
  }, [trigger]);

  if (particles.length === 0) return null;
  return (
    <div className="confetti-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            '--x': `${p.x}vw`,
            '--angle': `${p.angle}deg`,
            '--speed': `${p.speed}`,
            '--size': `${p.size}px`,
            '--rotation': `${p.rotation}deg`,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ── Modal overlay ──────────────────────────────────────────────────────────
function Modal({ open, onClose, children, maxWidth = 960 }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

// ── Publish everything to window ───────────────────────────────────────────
Object.assign(window, {
  Icon, Check, ProgressBar, Pill, SectionHead, Contact, Confetti, Modal,
});
})();
