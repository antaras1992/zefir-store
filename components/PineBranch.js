// Decorative fir branch with ornaments (original SVG). `flip` mirrors it for the right side.
function needles() {
  const out = [];
  // main stem from (10,20) curving to (230,70); needles on both sides
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const x = 10 + 220 * t;
    const y = 20 + 50 * t * t;
    const len = 26 - 12 * t;
    for (const s of [-1, 1]) {
      const a = (s * (55 + 10 * Math.sin(i))) * Math.PI / 180;
      out.push([x, y, x + Math.cos(a) * len * 0.6, y + Math.sin(a) * len]);
    }
  }
  // two side twigs
  for (const [bx, by, ex, ey] of [[70, 26, 120, 95], [140, 40, 175, 105]]) {
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, x = bx + (ex - bx) * t, y = by + (ey - by) * t, len = 16 - 7 * t;
      out.push([x, y, x - len * 0.9, y + len * 0.3], [x, y, x + len * 0.9, y + len * 0.2]);
    }
  }
  return out;
}
const N = needles();

export default function PineBranch({ flip = false, style }) {
  return (
    <svg viewBox="0 0 250 140" aria-hidden="true" style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <path d="M10 20 Q 120 30 230 70" stroke="#6B4A2E" strokeWidth="3" fill="none" />
      <path d="M70 26 L120 95 M140 40 L175 105" stroke="#6B4A2E" strokeWidth="2" fill="none" />
      {N.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 3 ? "#2F6B45" : "#3E8457"} strokeWidth="2.2" strokeLinecap="round" />
      ))}
      {/* ornaments */}
      <line x1="120" y1="95" x2="120" y2="104" stroke="#B89B5E" strokeWidth="1.2" />
      <circle cx="120" cy="113" r="10" fill="#C8373F" />
      <circle cx="116" cy="109" r="3" fill="#fff" opacity=".55" />
      <line x1="175" y1="105" x2="175" y2="112" stroke="#B89B5E" strokeWidth="1.2" />
      <circle cx="175" cy="119" r="8" fill="#D4AF37" />
      <circle cx="172" cy="116" r="2.4" fill="#fff" opacity=".6" />
      <circle cx="60" cy="58" r="6" fill="#D4537E" />
      <circle cx="58" cy="56" r="1.8" fill="#fff" opacity=".6" />
    </svg>
  );
}
