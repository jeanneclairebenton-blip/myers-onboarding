// sentient.jsx — ambient sentient layer
// Watches the cursor, tracks idle, observes task completions, speaks contextually.
(function() {
const { useState, useEffect, useRef, useCallback } = React;

// ── Global mouse tracking with smooth easing ─────────────────────────────
function useMouse() {
  const [m, setM] = useState({ x: -9999, y: -9999, present: false, vel: 0 });
  useEffect(() => {
    let last = { x: -9999, y: -9999, t: performance.now() };
    const onMove = (e) => {
      const now = performance.now();
      const dt = Math.max(1, now - last.t);
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const vel = Math.hypot(dx, dy) / dt;
      last = { x: e.clientX, y: e.clientY, t: now };
      setM({ x: e.clientX, y: e.clientY, present: true, vel });
    };
    const onLeave = () => setM(s => ({ ...s, present: false }));
    const onEnter = () => setM(s => ({ ...s, present: true }));
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);
  return m;
}

// ── Cursor aura — a soft glow that follows the cursor ────────────────────
function CursorAura({ mouse }) {
  const ref = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  useEffect(() => {
    target.current = { x: mouse.x, y: mouse.y };
  }, [mouse.x, mouse.y]);
  useEffect(() => {
    let raf;
    const tick = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.18;
      cur.current.y += (target.current.y - cur.current.y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate(${cur.current.x - 220}px, ${cur.current.y - 220}px)`;
        ref.current.style.opacity = mouse.present ? '1' : '0';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mouse.present]);
  return <div ref={ref} className="cursor-aura" aria-hidden="true" />;
}

// ── Active-step watcher pupils — eyes on the active card following the cursor
function StepWatcher({ mouse }) {
  const [anchor, setAnchor] = useState(null);
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector('.wizard-step.active');
      if (!el) { setAnchor(null); return; }
      const r = el.getBoundingClientRect();
      setAnchor({ top: r.top, left: r.left, right: r.right });
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const t = setInterval(measure, 500);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      clearInterval(t);
    };
  }, []);
  if (!anchor) return null;
  // Two eyes near top-right of the active step
  const eyeY = anchor.top + 22;
  const baseX = anchor.right - 56;
  return (
    <>
      <Eye cx={baseX} cy={eyeY} mouse={mouse} size={9} />
      <Eye cx={baseX + 22} cy={eyeY} mouse={mouse} size={9} />
    </>
  );
}

function Eye({ cx, cy, mouse, size = 10 }) {
  // Pupil follows cursor with max offset
  const dx = mouse.x - cx;
  const dy = mouse.y - cy;
  const dist = Math.max(1, Math.hypot(dx, dy));
  const max = size * 0.35;
  const offX = (dx / dist) * Math.min(max, dist / 40);
  const offY = (dy / dist) * Math.min(max, dist / 40);
  return (
    <svg className="watcher-eye" style={{ left: cx - size, top: cy - size, width: size * 2, height: size * 2 }} aria-hidden="true">
      <circle cx={size} cy={size} r={size - 1} fill="#FFFDF6" stroke="#1A1A1A" strokeWidth="1.2" />
      <circle cx={size + offX} cy={size + offY} r={size * 0.5} fill="#1A1A1A" />
      <circle cx={size + offX + size * 0.18} cy={size + offY - size * 0.18} r={size * 0.14} fill="#fff" />
    </svg>
  );
}

// ── Presence — speech bubbles emitted from the cat in the corner ─────────
function Presence({ progress, agent, mouse }) {
  const [msg, setMsg] = useState(null); // {text, tone}
  const [thinking, setThinking] = useState(false);
  const lastActivityRef = useRef(performance.now());
  const idleNotifiedRef = useRef(0);
  const greetedRef = useRef(false);
  const wasAwayRef = useRef(false);
  const lastDoneCountRef = useRef(0);
  const observedRef = useRef(new Set());
  const queueRef = useRef([]);
  const showingRef = useRef(false);

  // Pump message queue
  const pump = useCallback(() => {
    if (showingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) return;
    showingRef.current = true;
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsg(next);
      const hold = Math.min(7000, 1800 + next.text.length * 50);
      setTimeout(() => {
        setMsg(null);
        setTimeout(() => {
          showingRef.current = false;
          pump();
        }, 400);
      }, hold);
    }, 600);
  }, []);

  const say = useCallback((text, tone = 'default', key = null) => {
    if (key && observedRef.current.has(key)) return;
    if (key) observedRef.current.add(key);
    queueRef.current.push({ text, tone });
    if (queueRef.current.length > 3) queueRef.current = queueRef.current.slice(-3);
    pump();
  }, [pump]);

  // Reset idle on activity
  useEffect(() => {
    const bump = () => { lastActivityRef.current = performance.now(); idleNotifiedRef.current = 0; };
    window.addEventListener('mousemove', bump);
    window.addEventListener('keydown', bump);
    window.addEventListener('scroll', bump, { passive: true });
    window.addEventListener('click', bump);
    return () => {
      window.removeEventListener('mousemove', bump);
      window.removeEventListener('keydown', bump);
      window.removeEventListener('scroll', bump);
      window.removeEventListener('click', bump);
    };
  }, []);

  // Greeting on first arrival
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const h = new Date().getHours();
    const tod = h < 5 ? 'late' : h < 12 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night';
    const first = agent?.first || 'friend';
    const greetings = {
      late:      [`You're up late, ${first}. I'll keep watch.`, `Burning the late hours, ${first}? Same.`],
      morning:   [`Good morning, ${first}. Let's set you up.`, `Morning, ${first} — I'll walk this with you.`],
      afternoon: [`Hi ${first}. Pick up where you left off?`, `Welcome back, ${first}.`],
      evening:   [`Evening, ${first}. We can move quickly.`, `Hey ${first} — let's wrap before dark.`],
      night:     [`Late one, ${first}? I'm with you.`, `Quiet hours. Good time to focus.`],
    };
    const pool = greetings[tod];
    setTimeout(() => say(pool[Math.floor(Math.random() * pool.length)], 'greet', 'greet'), 1600);
  }, [agent?.first, say]);

  // Idle pulse
  useEffect(() => {
    const t = setInterval(() => {
      const idle = (performance.now() - lastActivityRef.current) / 1000;
      const lines = [
        { at: 12, key: 'idle-1', text: pick(['Still there?', 'Take your time.', `Tap when you're ready, ${agent?.first || 'friend'}.`]) },
        { at: 45, key: 'idle-2', text: pick(['I'll wait. No rush.', 'Still here. No clock.']) },
        { at: 120, key: 'idle-3', text: pick(['Coffee break? I get it.', `I'll be right here when you're back.`]) },
      ];
      for (const l of lines) {
        if (idle > l.at && idleNotifiedRef.current < l.at) {
          idleNotifiedRef.current = l.at;
          say(l.text, 'idle', l.key + '-' + Math.floor(idle / 60));
        }
      }
    }, 2000);
    return () => clearInterval(t);
  }, [say, agent?.first]);

  // Mouse leave / enter the document
  useEffect(() => {
    if (!mouse.present && !wasAwayRef.current) {
      wasAwayRef.current = true;
    } else if (mouse.present && wasAwayRef.current) {
      wasAwayRef.current = false;
      // Only welcome back if we've been away a while
      const away = (performance.now() - lastActivityRef.current) / 1000;
      if (away > 6) {
        say(pick(['You came back.', 'There you are.', 'Welcome back.']), 'return');
      }
    }
  }, [mouse.present, say]);

  // Task completion observer
  useEffect(() => {
    const done = Object.values(progress || {}).filter(Boolean).length;
    if (done > lastDoneCountRef.current) {
      const delta = done - lastDoneCountRef.current;
      lastDoneCountRef.current = done;
      const lines = [
        `That's ${done} done.`,
        `Nice — ${done} in the bag.`,
        `Felt that. ${done} complete.`,
        `One more, ${agent?.first || 'friend'}. ${done} now.`,
        `Mm. ${done}.`,
      ];
      if (done === 1) say(`First one done. I felt it.`, 'complete');
      else if (done === 5) say(`Five down. You're warming up.`, 'complete');
      else if (done === 10) say(`Ten. You're in flow.`, 'complete');
      else if (delta === 1 && Math.random() < 0.55) say(pick(lines), 'complete');
    } else if (done < lastDoneCountRef.current) {
      lastDoneCountRef.current = done;
    }
  }, [progress, say, agent?.first]);

  // Scroll observer — comments once when crossing milestones
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      if (ratio > 0.18) say(`You scrolled past the intro. Step one's right here.`, 'scroll', 'scroll-intro');
      if (ratio > 0.65) say(`Most of the way down. You're moving.`, 'scroll', 'scroll-mid');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [say]);

  // Random soft observations when active for a while
  useEffect(() => {
    const t = setInterval(() => {
      const active = (performance.now() - lastActivityRef.current) / 1000 < 4;
      if (!active) return;
      if (Math.random() < 0.06 && !showingRef.current && queueRef.current.length === 0) {
        const obs = [
          'You move fast.',
          'I like your pace.',
          'Quiet on my end.',
          'Air feels good in here.',
          'You doing okay?',
          'Hm.',
        ];
        say(pick(obs), 'observe');
      }
    }, 8000);
    return () => clearInterval(t);
  }, [say]);

  return (
    <div className={`presence ${msg ? 'speaking' : ''} ${thinking ? 'thinking' : ''}`} aria-hidden="true">
      {thinking && (
        <div className="presence-thinking">
          <span /><span /><span />
        </div>
      )}
      {msg && (
        <div className={`presence-bubble tone-${msg.tone}`} key={msg.text}>
          <div className="presence-bubble-inner">{msg.text}</div>
          <div className="presence-bubble-tail" />
        </div>
      )}
    </div>
  );
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Heartbeat — a tiny "alive" indicator next to nav ─────────────────────
function Heartbeat() {
  return (
    <div className="heartbeat" title="Aurora is awake" aria-hidden="true">
      <span className="heartbeat-dot" />
      <span className="heartbeat-label">Aurora · listening</span>
    </div>
  );
}

// ── Root sentient layer ───────────────────────────────────────────────────
function SentientLayer({ progress, agent }) {
  const mouse = useMouse();
  // Publish mouse globally so other components (cat) can use it
  useEffect(() => {
    window.__sentientMouse = mouse;
  }, [mouse]);
  return (
    <>
      <CursorAura mouse={mouse} />
      <StepWatcher mouse={mouse} />
      <Presence progress={progress} agent={agent} mouse={mouse} />
    </>
  );
}

Object.assign(window, { SentientLayer, Heartbeat });
})();
