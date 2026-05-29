// screens.jsx — wizard view + team page
(function() {
const { useState, useEffect, useRef } = React;
const { Icon, Check, ProgressBar, Pill, SectionHead, Contact } = window;
const PHASES = window.MYERS_DATA.PHASES;
const TEAM = window.MYERS_DATA.TEAM;

// ── Wizard ────────────────────────────────────────────────────────────────
function Wizard({ progress, agent, goTo, toggleTask, openMarketing, updateAgent, openSync, syncSubmitted }) {
  // Determine which step is active: first step that's not fully complete
  // (Optional tasks don't block step completion)
  const stepIsDone = (phase) => phase.tasks.filter(t => !t.optional).every(t => progress[t.id]);
  const activeIdx = PHASES.findIndex(p => !stepIsDone(p));
  // If all done, last step is "active" (showing as review)
  const effectiveActiveIdx = activeIdx === -1 ? PHASES.length - 1 : activeIdx;

  const allRequired = PHASES.flatMap(p => p.tasks.filter(t => !t.optional));
  const totalTasks = allRequired.length;
  const doneTasks = allRequired.filter(t => progress[t.id]).length;
  const pct = Math.round((doneTasks / totalTasks) * 100);

  // Track which "done" steps are manually expanded
  const [expanded, setExpanded] = useState({});

  const isExpanded = (idx) => {
    if (idx === effectiveActiveIdx) return true;
    return !!expanded[PHASES[idx].id];
  };
  const toggleExpand = (idx) => {
    const phase = PHASES[idx];
    if (idx > effectiveActiveIdx) return; // locked
    if (idx === effectiveActiveIdx) return; // always open
    setExpanded(s => ({ ...s, [phase.id]: !s[phase.id] }));
  };

  // Auto-scroll to active step when it changes
  const prevActiveRef = useRef(activeIdx);
  useEffect(() => {
    if (activeIdx !== prevActiveRef.current && activeIdx > prevActiveRef.current) {
      // Step advanced — scroll to new active step
      setTimeout(() => {
        const el = document.querySelector(`[data-step-id="${PHASES[activeIdx].id}"]`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    }
    prevActiveRef.current = activeIdx;
  }, [activeIdx]);

  return (
    <div>
      {/* Hero */}
      <section className="wizard-hero">
        <div className="kicker" style={{ marginBottom: 16, color: 'var(--gold-deep)' }}>
          <span className="dot" style={{ color: 'var(--gold)' }} />&nbsp;&nbsp;Step {Math.min(effectiveActiveIdx + 1, PHASES.length)} of {PHASES.length} · {pct === 100 ? 'Complete' : `${pct}% complete`}
        </div>
        <h1 className="h-display">
          Welcome, <span style={{ color: 'var(--gold-deep)', fontStyle: 'italic' }}>{agent.first}</span>.
        </h1>
        <h2 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-2)', fontSize: 28, fontWeight: 400, marginTop: 8 }}>
          Let's build your business.
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginTop: 20, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          You're not just joining a brokerage — you're starting a real estate practice with a back office, brand, and team behind you. We'll walk you through each step.
        </p>
      </section>

      {/* Step progress segments */}
      <div className="step-progress-track">
        {PHASES.map((p, i) => {
          const cls = i < effectiveActiveIdx ? 'done' : i === effectiveActiveIdx ? 'active' : '';
          return <div key={p.id} className={`seg ${cls}`} />;
        })}
      </div>

      {/* Steps */}
      <div className="wizard">
        {PHASES.map((phase, idx) => {
          const status = idx < effectiveActiveIdx
            ? 'done'
            : idx === effectiveActiveIdx
              ? (stepIsDone(phase) ? 'done' : 'active')
              : 'locked';
          // Adjusted: if active idx phase is fully done (last step case), still show as active body
          const realStatus = idx === effectiveActiveIdx && activeIdx === -1 ? 'done' : status;
          const open = isExpanded(idx);
          return (
            <WizardStep
              key={phase.id}
              phase={phase}
              idx={idx}
              status={realStatus}
              open={open}
              onToggle={() => toggleExpand(idx)}
              progress={progress}
              toggleTask={toggleTask}
              openMarketing={openMarketing}
              agent={agent}
              updateAgent={updateAgent}
            />
          );
        })}

        {pct === 100 && <CompletionBanner agent={agent} goTo={goTo} progress={progress} openSync={openSync} submitted={syncSubmitted} />}
      </div>
    </div>
  );
}

function CompletionBanner({ agent, goTo, progress, openSync, submitted }) {
  return (
    <div className="card card-pad" style={{ background: 'linear-gradient(135deg, var(--ink), #2a2520)', color: 'var(--cream)', borderColor: 'var(--ink)', marginTop: 32, textAlign: 'center', padding: 48 }}>
      <Icon.Sparkle style={{ width: 24, height: 24, color: 'var(--gold)', marginBottom: 16 }} />
      <h2 className="h2" style={{ color: 'var(--cream)', marginBottom: 12 }}>You're fully operational, {agent.first}.</h2>
      <p style={{ color: 'var(--cream-soft)', fontSize: 15, maxWidth: 480, margin: '0 auto 24px' }}>
        {submitted
          ? 'Your record is synced with the Myers team. Time to meet everyone.'
          : 'One last step — submit your record to the Myers team so we can finalize your file.'}
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {!submitted && (
          <button className="btn gold" onClick={openSync}>
            <Icon.Sparkle /> Submit to Drive (required)
          </button>
        )}
        <button
          className={submitted ? 'btn gold' : 'btn ghost'}
          style={submitted ? null : { color: 'var(--cream)', borderColor: 'rgba(251, 232, 199, 0.2)', opacity: 0.45, cursor: 'not-allowed' }}
          disabled={!submitted}
          onClick={() => submitted && goTo({ view: 'team' })}
          title={submitted ? 'Meet the team' : 'Submit to Drive first'}
        >
          {submitted ? <>Meet the team <Icon.Arrow /></> : <>🔒 Meet the team</>}
        </button>
      </div>
    </div>
  );
}

// ── Sitting cat — appears on profile step only ───────────────────────────
function SittingCat() {
  return (
    <div className="sitting-cat" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="70" height="70" style={{ overflow: 'visible' }}>
        {/* Tail wrapped around right side */}
        <path
          d="M 130 170 Q 168 168 172 130 Q 168 100 144 102"
          fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        />
        <path d="M 156 162 L 166 156" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 162 142 L 170 138" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 162 120 L 168 118" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />

        {/* Body — sitting upright, narrower at top */}
        <path
          d="M 64 175 Q 56 135 70 110 Q 86 92 100 92 Q 114 92 130 110 Q 144 135 136 175 Q 134 182 100 182 Q 66 182 64 175 Z"
          fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round"
        />
        {/* White belly chest */}
        <path d="M 84 130 Q 86 160 100 168 Q 114 160 116 130 Q 100 122 84 130 Z" fill="#FFF1DD" />

        {/* Body stripes */}
        <path d="M 72 120 Q 70 140 74 160" stroke="#9B4F12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 128 120 Q 130 140 126 160" stroke="#9B4F12" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Front paws */}
        <ellipse cx="86" cy="178" rx="10" ry="5" fill="#FFCFA0" stroke="#1A1A1A" strokeWidth="2" />
        <ellipse cx="114" cy="178" rx="10" ry="5" fill="#FFCFA0" stroke="#1A1A1A" strokeWidth="2" />
        <circle cx="84" cy="178" r="1.5" fill="#E89090" />
        <circle cx="89" cy="178" r="1.5" fill="#E89090" />
        <circle cx="112" cy="178" r="1.5" fill="#E89090" />
        <circle cx="117" cy="178" r="1.5" fill="#E89090" />

        {/* Head — round and cute */}
        <path
          d="M 60 70 Q 60 38 100 38 Q 140 38 140 70 Q 140 102 100 102 Q 60 102 60 70 Z"
          fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5"
        />

        {/* Forehead stripes */}
        <path d="M 90 42 Q 92 50 90 56" stroke="#9B4F12" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M 100 38 L 100 50" stroke="#9B4F12" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M 110 42 Q 108 50 110 56" stroke="#9B4F12" strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* Ears */}
        <path d="M 64 56 L 56 26 L 86 42 Z" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 136 56 L 144 26 L 114 42 Z" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 66 52 L 62 32 L 82 42 Z" fill="#FFB8A0" />
        <path d="M 134 52 L 138 32 L 118 42 Z" fill="#FFB8A0" />

        {/* Cheek fluff */}
        <ellipse cx="60" cy="80" rx="11" ry="8" fill="#FFCFA0" />
        <ellipse cx="140" cy="80" rx="11" ry="8" fill="#FFCFA0" />

        {/* Eyes */}
        <ellipse cx="82" cy="72" rx="7" ry="9" fill="#fff" />
        <ellipse cx="118" cy="72" rx="7" ry="9" fill="#fff" />
        <ellipse cx="82" cy="73" rx="5" ry="7" fill="#C9941F" />
        <ellipse cx="118" cy="73" rx="5" ry="7" fill="#C9941F" />
        <ellipse cx="82" cy="74" rx="2.2" ry="4.5" fill="#1A1A1A" />
        <ellipse cx="118" cy="74" rx="2.2" ry="4.5" fill="#1A1A1A" />
        <circle cx="83.5" cy="71" r="1.6" fill="#fff" />
        <circle cx="119.5" cy="71" r="1.6" fill="#fff" />

        {/* Nose */}
        <path d="M 95 84 L 105 84 L 100 88 Z" fill="#E89090" stroke="#1A1A1A" strokeWidth="1" strokeLinejoin="round" />

        {/* Mouth */}
        <path d="M 100 88 Q 95 92 91 90" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 100 88 Q 105 92 109 90" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="68" y1="84" x2="50" y2="80" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="68" y1="88" x2="50" y2="90" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="132" y1="84" x2="150" y2="80" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="132" y1="88" x2="150" y2="90" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Step cat — small static cat decoration per step ─────────────────────
const STEP_CAT_POSES = {
  profile: { tilt: 0, accessory: null },
  paperwork: { tilt: -8, accessory: 'pen' },
  licensing: { tilt: 0, accessory: 'badge' },
  tools: { tilt: 6, accessory: 'laptop' },
  brand: { tilt: -4, accessory: 'brush' },
  closing: { tilt: 0, accessory: 'coin' },
};
function StepCat({ stepId }) {
  const cfg = STEP_CAT_POSES[stepId] || {};
  return (
    <div className="step-cat" aria-hidden="true" style={{ transform: `rotate(${cfg.tilt}deg)` }}>
      <svg viewBox="0 0 200 200" width="58" height="58" style={{ overflow: 'visible' }}>
        <path d="M 130 170 Q 162 168 168 130 Q 164 102 144 102" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M 158 158 L 166 152" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 162 130 L 168 128" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 64 175 Q 56 135 70 110 Q 86 92 100 92 Q 114 92 130 110 Q 144 135 136 175 Q 134 182 100 182 Q 66 182 64 175 Z" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 84 130 Q 86 160 100 168 Q 114 160 116 130 Q 100 122 84 130 Z" fill="#FFF1DD" />
        <path d="M 72 120 Q 70 140 74 160" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 128 120 Q 130 140 126 160" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="86" cy="178" rx="10" ry="5" fill="#FFCFA0" stroke="#1A1A1A" strokeWidth="2" />
        <ellipse cx="114" cy="178" rx="10" ry="5" fill="#FFCFA0" stroke="#1A1A1A" strokeWidth="2" />
        <path d="M 60 70 Q 60 38 100 38 Q 140 38 140 70 Q 140 102 100 102 Q 60 102 60 70 Z" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" />
        <path d="M 100 38 L 100 50" stroke="#9B4F12" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M 64 56 L 56 26 L 86 42 Z" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 136 56 L 144 26 L 114 42 Z" fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 66 52 L 62 32 L 82 42 Z" fill="#FFB8A0" />
        <path d="M 134 52 L 138 32 L 118 42 Z" fill="#FFB8A0" />
        <ellipse cx="82" cy="73" rx="3" ry="5" fill="#1A1A1A" />
        <ellipse cx="118" cy="73" rx="3" ry="5" fill="#1A1A1A" />
        <circle cx="83" cy="71" r="1.2" fill="#fff" />
        <circle cx="119" cy="71" r="1.2" fill="#fff" />
        <path d="M 95 84 L 105 84 L 100 88 Z" fill="#E89090" />
        <path d="M 100 88 Q 95 92 91 90" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 100 88 Q 105 92 109 90" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <line x1="68" y1="84" x2="50" y2="80" stroke="#5A4112" strokeWidth="0.8" />
        <line x1="132" y1="84" x2="150" y2="80" stroke="#5A4112" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// ── Reusable task box ─────────────────────────────────────────────────────
const ICON_MAP = {
  Badge: () => Icon.Badge, Group: () => Icon.Group, Home: () => Icon.Home, Key: () => Icon.Key,
  Mail: () => Icon.Mail, Folder: () => Icon.Folder, Chat: () => Icon.Chat, Zap: () => Icon.Zap,
  Shield: () => Icon.Shield, Doc: () => Icon.Doc, Calendar: () => Icon.Calendar, Money: () => Icon.Money,
  Signature: () => Icon.Signature, Receipt: () => Icon.Receipt, CreditCard: () => Icon.CreditCard,
};
function TaskBox({ task, checked, onToggle }) {
  const [imgExpanded, setImgExpanded] = React.useState(false);
  const iconKey = task.icon ? task.icon[0].toUpperCase() + task.icon.slice(1) : null;
  const IconComp = (iconKey && ICON_MAP[iconKey]) ? ICON_MAP[iconKey]() : Icon.Doc;
  const accent = task.accent || 'var(--gold)';
  return (
    <div
      className={`task-box ${checked ? 'checked' : ''}`}
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        background: checked ? 'var(--cream-soft)' : 'var(--surface)',
        border: `1px solid ${checked ? 'var(--cream-deep)' : 'var(--hairline)'}`,
        borderRadius: 'var(--r-lg)',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 160,
        position: 'relative',
      }}
    >
      {!checked && task.accent && (
        <div style={{
          position: 'absolute', top: 0, left: 18, right: 18, height: 2,
          background: accent, borderRadius: '0 0 4px 4px',
        }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: checked ? 'var(--ink)' : `${accent}18`,
          color: accent,
          display: 'grid', placeItems: 'center', flexShrink: 0,
          transition: 'all 200ms',
        }}>
          <IconComp style={{ width: 16, height: 16 }} />
        </div>
        <Check checked={checked} onClick={(e) => { e.stopPropagation(); onToggle(); }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3, textDecoration: checked ? 'line-through' : 'none', textDecorationColor: 'var(--muted)' }}>
          {task.title.replace(/\s*\(optional\)\s*$/i, '')}
        </div>
        {task.optional && <span className="task-opt" style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700, padding: '2px 6px', background: 'var(--bg-soft)', borderRadius: 4 }}>Optional</span>}
      </div>
      <div className="task-desc" style={{ flex: 1, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{task.desc}</div>
      {task.image && (
        <>
          <div 
            onClick={(e) => { e.stopPropagation(); setImgExpanded(true); }}
            style={{ marginTop: 10, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--hairline)', background: 'var(--bg-soft)', cursor: 'zoom-in' }}>
            <img src={task.image} alt="Guide" style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 200, objectFit: 'contain' }} />
          </div>
          {imgExpanded && (
            <div 
              onClick={(e) => { e.stopPropagation(); setImgExpanded(false); }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, cursor: 'zoom-out' }}>
              <img src={task.image} alt="Guide Expanded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} />
            </div>
          )}
        </>
      )}
      {task.links && task.links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
          {task.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 9px',
                background: 'var(--surface)',
                border: `1px solid ${accent}40`,
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 600,
                color: accent,
                transition: 'all 120ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}12`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; }}
            >
              {link.label}
              <Icon.External style={{ width: 10, height: 10 }} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Single wizard step ────────────────────────────────────────────────────
function WizardStep({ phase, idx, status, open, onToggle, progress, toggleTask, openMarketing, agent, updateAgent }) {
  const requiredTasks = phase.tasks.filter(t => !t.optional);
  const done = requiredTasks.filter(t => progress[t.id]).length;
  const total = requiredTasks.length;
  const stepWords = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
  return (
    <div className={`wizard-step ${status}`} data-step-id={phase.id} data-screen-label={`${phase.num} ${phase.title}`}>
      <div className="step-header" onClick={onToggle} role="button" aria-expanded={open}>
        <div className="step-num">
          {status === 'done'
            ? <Icon.Check style={{ width: 18, height: 18 }} />
            : status === 'locked'
              ? <Icon.Lock />
              : status === 'active' ? phase.num : phase.num}
        </div>
        <div className="step-title-block">
          {status === 'active' && <div className="step-kicker">Step {stepWords[idx + 1] || (idx + 1)}</div>}
          <div className="step-title">{phase.title}</div>
          <div className="step-sub">{phase.subtitle}</div>
        </div>
        <div className="step-meta">
          {status === 'done'
            ? '✓ Complete'
            : status === 'active'
              ? (total > 1 ? `${done} of ${total}` : 'In progress')
              : 'Locked'}
        </div>
      </div>
      {open && (
        <div className="step-body">
          <p>
            {phase.description}
          </p>

          {phase.isProfile && <ProfileStep agent={agent} updateAgent={updateAgent} progress={progress} toggleTask={toggleTask} />}
          {phase.id === 'paperwork' && <PaperworkExtras progress={progress} toggleTask={toggleTask} />}
          {phase.id === 'licensing' && <LicensingExtras />}
          {phase.id === 'tools' && <ToolsExtras />}
          {phase.isMarketing && <BrandIntro openMarketing={openMarketing} progress={progress} toggleTask={toggleTask} />}
          {phase.id === 'closing' && <ClosingExtras />}

          {!phase.isMarketing && !phase.isProfile && phase.id !== 'paperwork' && (() => {
            // Group tasks if any task has a group field
            const hasGroups = phase.tasks.some(t => t.group);
            const groupedTasks = hasGroups
              ? phase.tasks.reduce((acc, t) => {
                  const g = t.group || 'Other';
                  if (!acc[g]) acc[g] = [];
                  acc[g].push(t);
                  return acc;
                }, {})
              : { '_': phase.tasks };
            const groupOrder = hasGroups ? Object.keys(groupedTasks) : ['_'];
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {groupOrder.map(groupName => (
                  <div key={groupName}>
                    {hasGroups && (
                      <div className="eyebrow" style={{ marginBottom: 10 }}>{groupName}</div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                      {groupedTasks[groupName].map((task) => (
                        <TaskBox
                          key={task.id}
                          task={task}
                          checked={!!progress[task.id]}
                          onToggle={() => toggleTask(task.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function ProfileSelect({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--sans)',
          border: '1px solid var(--hairline-strong)', borderRadius: 6, background: 'var(--surface)',
          color: 'var(--ink)', outline: 'none', fontWeight: 500, cursor: 'pointer',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
      >
        <option value="" disabled>Select your role</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// ── Profile step (photo + name + title) ───────────────────────────────────
function ProfileStep({ agent, updateAgent, progress, toggleTask }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type?.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateAgent({ photo: e.target.result });
    };
    reader.readAsDataURL(file);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFile(e.dataTransfer.files[0]);
  };
  const onPick = (e) => {
    if (e.target.files?.length) handleFile(e.target.files[0]);
  };

  return (
    <div className="grid-2" style={{ gap: 32, alignItems: 'flex-start' }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Headshot <span style={{ color: 'var(--faint)', textTransform: 'none', letterSpacing: 0, marginLeft: 6 }}>· optional</span></div>
        <label
          className={`photo-drop ${agent.photo ? 'has-photo' : ''} ${dragOver ? 'dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} />
          {agent.photo ? (
            <>
              <div className="photo-preview" style={{ backgroundImage: `url(${agent.photo})` }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold-deep)' }}>Click or drop to swap</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Carries through to every marketing template.</div>
            </>
          ) : (
            <>
              <Icon.Upload style={{ width: 32, height: 32, color: 'var(--gold)', marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 700 }}>Drop your headshot here</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>or click to browse · JPG/PNG · head & shoulders works best</div>
            </>
          )}
        </label>
      </div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Your details</div>
        <ProfileInput
          label="Full name"
          value={(agent.fullName || '').replace(/[\n\r]/g, '')}
          onChange={(v) => {
            const clean = v.replace(/[\n\r]/g, '').replace(/\s+/g, ' ');
            const parts = clean.split(' ');
            updateAgent({ fullName: clean, first: parts[0] || '', last: parts.slice(1).join(' ') || '' });
          }}
        />
        <ProfileSelect label="Title / role" value={agent.title} options={['Investment Consultant', 'Acquisitions Specialist']} onChange={(v) => updateAgent({ title: v })} />
        <ProfileInput label="Phone" value={agent.phone} onChange={(v) => updateAgent({ phone: v })} />
        <ProfileInput label="Email" value={agent.email} onChange={(v) => updateAgent({ email: v })} />
        <div style={{ marginTop: 20 }}>
          <button
            className="btn gold lg"
            onClick={() => {
              if (!progress['profile-done']) {
                toggleTask('profile-done');
                if (window.GOOGLE_SHEETS_WEBHOOK_URL) {
                  fetch(window.GOOGLE_SHEETS_WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({
                      type: 'profile',
                      agent: {
                        title: agent.title,
                        phone: agent.phone,
                        email: agent.email,
                        fullName: agent.fullName
                      }
                    })
                  }).catch(e => console.error('Error posting to sheets', e));
                }
              }
            }}
            disabled={!!progress['profile-done']}
            style={progress['profile-done'] ? { background: 'var(--ink)', borderColor: 'var(--ink)', opacity: 1 } : null}
          >
            {progress['profile-done'] ? <><Icon.Check /> Confirmed — moving on</> : <>Confirm & continue <Icon.Arrow /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileInput({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '.04em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{label}</label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', fontSize: 14, fontFamily: 'var(--sans)',
          border: '1px solid var(--hairline-strong)', borderRadius: 6, background: 'var(--surface)',
          color: 'var(--ink)', outline: 'none', fontWeight: 500,
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--gold)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--hairline-strong)'}
      />
    </div>
  );
}


// ── Phase-specific extras ─────────────────────────────────────────────────
function PaperworkExtras({ progress, toggleTask }) {
  const docs = [
    { id: 'sponsorship', title: 'Sponsorship Agreement', sub: 'Official affiliation with Myers', icon: Icon.Signature, accent: '#F5B021', tag: '1 of 3' },
    { id: 'w9', title: 'W-9 Form', sub: '1099 contractor tax docs', icon: Icon.Receipt, accent: '#D69B2D', tag: '2 of 3' },
    { id: 'cc-auth', title: 'CC Authorization', sub: '$149/mo membership fee', icon: Icon.CreditCard, accent: '#A07A1F', tag: '3 of 3' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {docs.map(doc => {
        const done = !!progress[doc.id];
        const IconComp = doc.icon;
        return (
          <div
            key={doc.id}
            className="task-box"
            onClick={() => toggleTask(doc.id)}
            style={{
              cursor: 'pointer',
              background: done ? 'var(--cream-soft)' : 'var(--surface)',
              border: `1px solid ${done ? 'var(--cream-deep)' : 'var(--hairline)'}`,
              borderRadius: 'var(--r-lg)',
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              minHeight: 160,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: done ? 'var(--ink)' : `${doc.accent}18`,
                color: doc.accent,
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <IconComp style={{ width: 16, height: 16 }} />
              </div>
              <Check checked={done} onClick={(e) => { e.stopPropagation(); toggleTask(doc.id); }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Doc · {doc.tag}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{doc.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{doc.sub}</div>
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
              color: done ? 'var(--green)' : doc.accent, fontWeight: 700,
            }}>
              {done ? '✓ Signed' : 'Awaiting signature'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LicensingExtras() {
  const contacts = [
    { icon: Icon.Phone, label: 'TREC Phone', value: '512.936.3000', href: 'tel:5129363000' },
    { icon: Icon.Mail, label: 'TREC Email', value: 'realportal@trec.texas.gov', href: 'mailto:realportal@trec.texas.gov' },
    { icon: Icon.Phone, label: 'MetroTex', value: '(972) 618-3800', href: 'tel:9726183800' },
  ];
  return (
    <>
      <div className="card card-pad" style={{ background: 'var(--cream-soft)', borderColor: 'var(--cream-deep)' }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Your sponsoring broker ✓</div>
        <h3 className="h3" style={{ marginBottom: 8, fontSize: 17 }}>Myers "The Home Buyers"</h3>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
          <div>License <span className="code">#9005311-BB</span></div>
          <div>16479 N. Dallas Pkwy, Addison, TX 75001</div>
          <div>Josh DeShong Lic# <span className="code">0558435</span></div>
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Need help?</div>
        <div style={{
          display: 'flex',
          background: 'var(--bg-soft)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
        }}>
          {contacts.map((c, i) => {
            const IconComp = c.icon;
            return (
              <a key={c.label} href={c.href} style={{
                flex: 1,
                padding: '12px 14px',
                borderLeft: i > 0 ? '1px solid var(--hairline)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                minWidth: 0,
                transition: 'background 120ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--cream-soft)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <span style={{ color: 'var(--muted)', flexShrink: 0 }}><IconComp /></span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700 }}>{c.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.value}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ToolsExtras() {
  return null;
}

function BrandIntro({ openMarketing, progress, toggleTask }) {
  const { PHASES } = window.MYERS_DATA;
  const brand = PHASES.find(p => p.isMarketing);
  const iconMap = {
    'welcome-post': Icon.Sparkle,
    'email-sig': Icon.Mail,
    'cards': Icon.Doc,
    'website': Icon.External,
    'social-kit': Icon.Download,
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
      {brand.tasks.map(task => {
        const done = !!progress[task.id];
        const IconComp = iconMap[task.action] || Icon.Sparkle;
        return (
          <div key={task.id} className="card card-link task-box" onClick={() => {
            if (task.action) {
              openMarketing(task.action);
            } else if (task.links && task.links.length > 0) {
              window.open(task.links[0].href, '_blank');
              if (!progress[task.id]) toggleTask(task.id);
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 160, padding: 18, background: done ? 'var(--cream-soft)' : 'var(--surface)', borderColor: done ? 'var(--cream-deep)' : 'var(--hairline)', position: 'relative', cursor: 'pointer' }}>
            {!done && (
              <div style={{
                position: 'absolute', top: 0, left: 18, right: 18, height: 2,
                background: 'var(--gold)', borderRadius: '0 0 4px 4px',
              }} />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, background: done ? 'var(--ink)' : 'rgba(245, 176, 33, 0.15)', borderRadius: 8, color: done ? 'var(--gold)' : 'var(--gold-deep)', display: 'grid', placeItems: 'center' }}>
                {done ? <Icon.Check style={{ width: 16, height: 16 }} /> : <IconComp style={{ width: 16, height: 16 }} />}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{task.title}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{task.desc.split('.')[0]}.</div>
            </div>
            <div style={{ color: done ? 'var(--ink)' : 'var(--gold-deep)', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              {done ? 'Done ✓' : 'Open →'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ClosingExtras() {
  return null;
}

function DocCard({ icon, title, sub, highlight }) {
  return (
    <div className="card card-pad" style={{ background: highlight ? 'var(--cream-soft)' : 'var(--surface)', borderColor: highlight ? 'var(--cream-deep)' : 'var(--hairline)' }}>
      <div style={{ color: 'var(--gold-deep)', marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>
    </div>
  );
}

// ── Team page ─────────────────────────────────────────────────────────────
function TeamPage({ goTo }) {
  return (
    <div>
      <section style={{ padding: '40px 0 32px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="container">
          <button className="back-link" onClick={() => goTo({ view: 'dashboard' })}>
            <Icon.ArrowLeft /> Back to onboarding
          </button>
          <div className="kicker" style={{ marginBottom: 12 }}>The team</div>
          <h1 className="h1">The people <em style={{ color: 'var(--gold-deep)', fontStyle: 'italic' }}>behind your business</em>.</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {TEAM.map(m => (
              <div key={m.id} className="card card-pad">
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, marginBottom: 16 }}>{m.initials}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{m.name}</div>
                <div className="kicker" style={{ marginBottom: 12 }}>{m.role}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 14 }}>{m.bio}</div>
                {m.email && (
                  <a href={`mailto:${m.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'var(--bg-soft)', border: '1px solid var(--hairline)', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--gold-deep)' }}>
                    <Icon.Mail style={{ width: 12, height: 12 }} /> {m.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Sync to Google Sheets modal ──────────────────────────────────────────
function SyncToDriveModal({ agent, progress, onClose, onSubmitted }) {
  const [status, setStatus] = useState('idle'); // idle, syncing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const completedAt = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  // Count completed tasks
  const PHASES = window.MYERS_DATA.PHASES;
  const allTasks = PHASES.flatMap(p => p.tasks);
  const completedCount = allTasks.filter(t => progress[t.id]).length;

  const sheetRow = {
    'Name': agent.fullName,
    'Email': agent.email,
    'Phone': agent.phone,
    'License #': agent.license,
    'Title': agent.title,
    'Tasks Complete': completedCount + ' / ' + allTasks.length,
    'Synced at': completedAt,
  };

  const handleSubmit = async () => {
    setStatus('syncing');
    setErrorMsg('');
    try {
      const result = await window._myersSyncFull(agent, progress);
      if (result.success) {
        setStatus('success');
        onSubmitted && onSubmitted();
        setTimeout(() => { onClose(); }, 1600);
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Unknown error');
      }
    } catch (e) {
      setStatus('error');
      setErrorMsg(e.message || 'Failed to connect to Google Sheets');
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <div style={{ padding: '28px 36px 20px', borderBottom: '1px solid var(--hairline)' }}>
        <div className="kicker" style={{ marginBottom: 8 }}>Submit · Google Sheets + Drive</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Sync your progress.</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 560 }}>
          This will update your row in the <strong>New Agent Onboarding</strong> sheet and save your headshot + marketing files to a folder in <strong>2026 Recruiting</strong>.
        </p>
      </div>

      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Agent info preview */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SheetIcon /> Your record
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
            {Object.entries(sheetRow).map(([k, v], i) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', fontSize: 12, borderBottom: i < Object.keys(sheetRow).length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                <div style={{ padding: '8px 12px', background: 'var(--bg-soft)', color: 'var(--muted)', fontWeight: 600, borderRight: '1px solid var(--hairline)' }}>{k}</div>
                <div style={{ padding: '8px 12px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v || '—'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What gets synced */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <DriveIcon /> Where it goes
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px', borderBottom: '1px solid var(--hairline)' }}>
              <SheetIcon />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>New Agent Onboarding</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Task progress + marketing selections</div>
              </div>
              {status === 'success' && <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>✓ Synced</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px' }}>
              <Icon.Folder style={{ width: 14, height: 14, color: 'var(--gold-deep)' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>2026 Recruiting / {agent.fullName || 'Agent'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {agent.photo ? '📸 Headshot' : ''}
                  {agent.photo && progress['welcome-post'] ? ' · ' : ''}
                  {progress['welcome-post'] ? '🎨 Welcome post' : ''}
                  {!agent.photo && !progress['welcome-post'] ? 'No files to upload yet' : ' → saved to Drive'}
                </div>
              </div>
              {status === 'success' && <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>✓ Saved</span>}
            </div>
          </div>
        </div>
      </div>

      {status === 'error' && (
        <div style={{ padding: '0 28px 16px' }}>
          <div className="callout" style={{ background: '#FFF0F0', borderColor: '#E8A0A0', color: '#8B3030' }}>
            <strong>Sync failed:</strong> {errorMsg}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 28px 28px' }}>
        <button className="btn ghost" onClick={onClose}>Close</button>
        <button
          className="btn gold"
          onClick={handleSubmit}
          disabled={status === 'syncing' || status === 'success'}
        >
          {status === 'syncing' ? '⏳ Syncing…'
            : status === 'success' ? '✓ Synced!'
            : status === 'error' ? 'Retry'
            : 'Submit to Google Sheets'}
        </button>
      </div>
    </div>
  );
}

function SheetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
  );
}
function DriveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
  );
}

Object.assign(window, { Wizard, TeamPage, SyncToDriveModal });
})();
