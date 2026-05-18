// cat.jsx — Animated sitting/walking/running cat in the bottom-right corner
(function() {
const { useState, useEffect, useRef } = React;

function Cat({ progress }) {
  const [pose, setPose] = useState('stretch'); // sit | stretch | walk | run | rest | blink
  const [blink, setBlink] = useState(false);
  const [position, setPosition] = useState('right'); // right | left
  const [direction, setDirection] = useState('right'); // facing direction
  const [profileVisible, setProfileVisible] = useState(true);

  const onProfileStep = profileVisible;

  // Watch profile step visibility
  useEffect(() => {
    const check = () => {
      const el = document.querySelector('[data-step-id="profile"]');
      if (!el) { setProfileVisible(false); return; }
      const r = el.getBoundingClientRect();
      // Visible if any part is within the viewport
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      setProfileVisible(visible);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const t = setInterval(check, 800);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearInterval(t);
    };
  }, []);

  // Random blink loop — closes eyes briefly
  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        await wait(1800 + Math.random() * 4000);
        if (cancelled) return;
        setBlink(true);
        await wait(140);
        if (cancelled) return;
        setBlink(false);
        // Sometimes double-blink
        if (Math.random() < 0.3) {
          await wait(200);
          setBlink(true);
          await wait(140);
          setBlink(false);
        }
      }
    };
    loop();
    return () => { cancelled = true; };
  }, []);

  // On profile step, lock to stretch pose, stay on right
  useEffect(() => {
    if (onProfileStep) {
      setPose('stretch');
      setPosition('right');
      setDirection('right');
    } else if (pose === 'stretch') {
      setPose('sit');
    }
  }, [onProfileStep]);

  // Behavior loop — picks idle, stretch, walk, or run
  useEffect(() => {
    if (onProfileStep) return; // skip random behaviors on profile step
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        // Idle period
        await wait(5000 + Math.random() * 6000);
        if (cancelled) return;

        const choice = Math.random();

        if (choice < 0.25) {
          // Stretch
          setPose('stretch');
          await wait(2200);
          if (cancelled) return;
          setPose('sit');
        } else if (choice < 0.6) {
          // Walk left, rest, walk right
          setPose('walk');
          setDirection('left');
          setPosition('left');
          await wait(2800);
          if (cancelled) return;
          setPose('rest');
          await wait(1100);
          if (cancelled) return;
          setPose('walk');
          setDirection('right');
          setPosition('right');
          await wait(2800);
          if (cancelled) return;
          setPose('sit');
        } else {
          // Run left, pause, run right
          setPose('run');
          setDirection('left');
          setPosition('left');
          await wait(2000);
          if (cancelled) return;
          setPose('rest');
          await wait(800);
          if (cancelled) return;
          setPose('run');
          setDirection('right');
          setPosition('right');
          await wait(2000);
          if (cancelled) return;
          setPose('sit');
        }
      }
    };
    loop();
    return () => { cancelled = true; };
  }, []);

  const moving = pose === 'walk' || pose === 'run';

  return (
    <div className={`bottom-cat pose-${pose} pos-${position} dir-${direction}`} aria-hidden="true">
      <div className="cat-inner">
        <CatSvg blink={blink} pose={pose} moving={moving} />
      </div>
    </div>
  );
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function CatSvg({ blink, pose, moving }) {
  return (
    <svg viewBox="0 0 200 200" width="64" height="64" style={{ overflow: 'visible' }}>
      {/* Tail */}
      <g className="cat-tail-grp">
        <path
          d="M 130 170 Q 168 168 172 130 Q 168 100 144 102"
          fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
        />
        <path d="M 156 162 L 166 156" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 162 142 L 170 138" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
        <path d="M 162 120 L 168 118" stroke="#9B4F12" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Body — gets wider when stretching */}
      <g className="cat-body-grp">
        <path
          d="M 64 175 Q 56 135 70 110 Q 86 92 100 92 Q 114 92 130 110 Q 144 135 136 175 Q 134 182 100 182 Q 66 182 64 175 Z"
          fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5" strokeLinejoin="round"
        />
        <path d="M 84 130 Q 86 160 100 168 Q 114 160 116 130 Q 100 122 84 130 Z" fill="#FFF1DD" />
        <path d="M 72 120 Q 70 140 74 160" stroke="#9B4F12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 128 120 Q 130 140 126 160" stroke="#9B4F12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>

      {/* Paws — animated when moving */}
      <g className={`cat-paw cat-paw-left ${moving ? `moving-${pose}` : ''}`}>
        <ellipse cx="86" cy="178" rx="10" ry="5" fill="#FFCFA0" stroke="#1A1A1A" strokeWidth="2" />
        <circle cx="84" cy="178" r="1.5" fill="#E89090" />
        <circle cx="89" cy="178" r="1.5" fill="#E89090" />
      </g>
      <g className={`cat-paw cat-paw-right ${moving ? `moving-${pose}` : ''}`}>
        <ellipse cx="114" cy="178" rx="10" ry="5" fill="#FFCFA0" stroke="#1A1A1A" strokeWidth="2" />
        <circle cx="112" cy="178" r="1.5" fill="#E89090" />
        <circle cx="117" cy="178" r="1.5" fill="#E89090" />
      </g>

      {/* Head */}
      <g className="cat-head-grp">
        <path
          d="M 60 70 Q 60 38 100 38 Q 140 38 140 70 Q 140 102 100 102 Q 60 102 60 70 Z"
          fill="#E8842A" stroke="#1A1A1A" strokeWidth="2.5"
        />
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

        {/* Eyes — open or closed (blink) */}
        {blink ? (
          <>
            <path d="M 76 72 Q 82 76 88 72" stroke="#1A1A1A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M 112 72 Q 118 76 124 72" stroke="#1A1A1A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="82" cy="72" rx="7" ry="9" fill="#fff" />
            <ellipse cx="118" cy="72" rx="7" ry="9" fill="#fff" />
            <ellipse cx="82" cy="73" rx="5" ry="7" fill="#C9941F" />
            <ellipse cx="118" cy="73" rx="5" ry="7" fill="#C9941F" />
            <ellipse cx="82" cy="74" rx="2.2" ry="4.5" fill="#1A1A1A" />
            <ellipse cx="118" cy="74" rx="2.2" ry="4.5" fill="#1A1A1A" />
            <circle cx="83.5" cy="71" r="1.6" fill="#fff" />
            <circle cx="119.5" cy="71" r="1.6" fill="#fff" />
          </>
        )}

        {/* Nose */}
        <path d="M 95 84 L 105 84 L 100 88 Z" fill="#E89090" stroke="#1A1A1A" strokeWidth="1" strokeLinejoin="round" />
        <path d="M 100 88 Q 95 92 91 90" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 100 88 Q 105 92 109 90" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="68" y1="84" x2="50" y2="80" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="68" y1="88" x2="50" y2="90" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="132" y1="84" x2="150" y2="80" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
        <line x1="132" y1="88" x2="150" y2="90" stroke="#5A4112" strokeWidth="0.9" strokeLinecap="round" />
      </g>
    </svg>
  );
}

Object.assign(window, { Cat });
})();
