// tweaks-panel.jsx — Developer tweaks sidebar
(function() {
const { useState, useEffect, useCallback } = React;

const STORAGE_KEY = 'myers-tweaks-v2';

function useTweaks(defaults) {
  const [tweaks, setTweaks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaults, ...JSON.parse(raw) };
    } catch (e) {}
    return { ...defaults };
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks)); } catch (e) {}
  }, [tweaks]);

  const setTweak = useCallback((key, value) => {
    setTweaks(t => ({ ...t, [key]: value }));
  }, []);

  return [tweaks, setTweak];
}

function TweaksPanel({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="tweaks-toggle"
        onClick={() => setOpen(!open)}
        title="Dev Tweaks"
        aria-label="Toggle developer tweaks panel"
      >
        ⚙
      </button>
      <div className={`tweaks-panel ${open ? 'open' : ''}`}>
        <div className="tweaks-panel-header">
          <span style={{ fontWeight: 700, fontSize: 13 }}>Dev Tweaks</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <div className="tweaks-panel-body">
          {children}
        </div>
      </div>
    </>
  );
}

function TweakSection({ label }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
      textTransform: 'uppercase', color: 'var(--muted)',
      padding: '14px 0 6px', borderTop: '1px solid var(--hairline)',
      marginTop: 8,
    }}>
      {label}
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '4px 10px', fontSize: 11, fontWeight: value === opt ? 700 : 400,
              background: value === opt ? 'var(--gold)' : 'var(--surface)',
              color: value === opt ? '#fff' : 'var(--ink)',
              border: '1px solid ' + (value === opt ? 'var(--gold)' : 'var(--hairline)'),
              borderRadius: 5, cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 120ms ease',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 36, height: 20, borderRadius: 10, border: 'none',
          background: value ? 'var(--gold)' : 'var(--hairline-strong)',
          position: 'relative', cursor: 'pointer',
          transition: 'background 200ms',
        }}
      >
        <div style={{
          width: 16, height: 16, borderRadius: 8,
          background: '#fff', position: 'absolute', top: 2,
          left: value ? 18 : 2,
          transition: 'left 200ms',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }} />
      </button>
    </div>
  );
}

function TweakButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '8px 12px', marginTop: 8,
        fontSize: 11, fontWeight: 600, cursor: 'pointer',
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 6, color: 'var(--ink)',
        transition: 'all 120ms',
      }}
      onMouseEnter={e => e.target.style.borderColor = 'var(--gold)'}
      onMouseLeave={e => e.target.style.borderColor = 'var(--hairline)'}
    >
      {label}
    </button>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '6px 10px', fontSize: 12,
          border: '1px solid var(--hairline)', borderRadius: 6,
          background: 'var(--surface)', color: 'var(--ink)',
          fontFamily: 'var(--sans)', outline: 'none',
          textTransform: 'capitalize',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

Object.assign(window, {
  TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakButton, TweakSelect, useTweaks,
});
})();
