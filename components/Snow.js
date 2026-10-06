"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Season: Dec 1 – Jan 7 (viewer's local date)
function inSeason(d = new Date()) {
  const m = d.getMonth(), day = d.getDate();
  return m === 11 || (m === 0 && day <= 7);
}

// Light falling snow overlay. `always` forces it on (Christmas page), otherwise only in season.
export default function Snow({ always = false }) {
  const [flakes, setFlakes] = useState(null);
  const pathname = usePathname();
  // The Christmas page renders its own <Snow always />; avoid doubling it there
  const skip = !always && pathname === "/christmas-marshmallow-gifts";

  useEffect(() => {
    if (skip || (!always && !inSeason())) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const count = window.innerWidth < 640 ? 18 : 36;
    setFlakes(Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      size: 4 + Math.random() * 7,
      dur: 9 + Math.random() * 10,
      delay: -Math.random() * 18,
      sway: 15 + Math.random() * 35,
      opacity: 0.45 + Math.random() * 0.45,
      star: i % 4 === 0,
    })));
  }, [always, skip]);

  if (!flakes || skip) return null;

  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 40, overflow: "hidden" }}>
      <style>{`
        @keyframes zc-fall { from { transform: translate3d(0,-5vh,0) } to { transform: translate3d(var(--sway),105vh,0) } }
        @keyframes zc-spin { to { rotate: 360deg } }
      `}</style>
      {flakes.map((f, i) => (
        <span key={i} style={{
          position: "absolute", top: 0, left: `${f.left}%`,
          "--sway": `${f.sway}px`,
          animation: `zc-fall ${f.dur}s linear ${f.delay}s infinite`,
          opacity: f.opacity,
        }}>
          {f.star ? (
            <span style={{ display: "block", fontSize: f.size * 2, lineHeight: 1, color: "#A9BCD6", animation: `zc-spin ${f.dur}s linear infinite` }}>❄</span>
          ) : (
            <span style={{ display: "block", width: f.size, height: f.size, borderRadius: "50%", background: "#C3D2E6", boxShadow: "0 0 3px rgba(150,175,210,.6)" }} />
          )}
        </span>
      ))}
    </div>
  );
}
