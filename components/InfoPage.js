import { INSTAGRAM_URL, INSTAGRAM_HANDLE, FACEBOOK_URL, EMAIL, GOOGLE_REVIEW_URL } from "@/lib/site";

export const c = { pink: "#c8737a", rose: "#D4537E", dark: "#1C1A18", muted: "#5F5E5A", line: "#E8E5DF", bg: "#FAF8F5" };

const NAV = [
  { href: "/", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/shipping", label: "Shipping" },
  { href: "/faq", label: "FAQ" },
  { href: "/gallery", label: "Gallery" },
];

export function H2({ children }) {
  return <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 28, fontWeight: 500, margin: "36px 0 12px", color: c.dark }}>{children}</h2>;
}

export function P({ children }) {
  return <p style={{ fontSize: 15, lineHeight: 1.8, color: c.muted, margin: "0 0 14px" }}>{children}</p>;
}

export function List({ items }) {
  return (
    <ul style={{ margin: "0 0 14px", paddingLeft: 20, fontSize: 15, lineHeight: 1.9, color: c.muted }}>
      {items.map((t, i) => <li key={i}>{t}</li>)}
    </ul>
  );
}

export function Button({ href, children, external }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ display: "inline-block", background: c.rose, color: "#fff", padding: "13px 28px", borderRadius: 6, textDecoration: "none", fontSize: 14, fontWeight: 500, margin: "6px 10px 6px 0" }}>
      {children}
    </a>
  );
}

export function ReviewButton() {
  if (!GOOGLE_REVIEW_URL) return null;
  return <Button href={GOOGLE_REVIEW_URL} external>⭐ Leave us a Google review</Button>;
}

export default function InfoPage({ eyebrow, title, children, jsonLd }) {
  return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: "'Inter',-apple-system,sans-serif", color: c.dark }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <header style={{ background: "#fff", borderBottom: `1px solid ${c.line}`, padding: "16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <a href="/" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 22, letterSpacing: 2, color: c.dark, textDecoration: "none" }}>
            ZEFIR <span style={{ color: c.rose }}>CANADA</span>
          </a>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} style={{ fontSize: 13, color: c.muted, textDecoration: "none" }}>{n.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 16px 56px" }}>
        {eyebrow && <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: c.rose, marginBottom: 8 }}>{eyebrow}</div>}
        <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 40, fontWeight: 500, margin: "0 0 20px", lineHeight: 1.15 }}>{title}</h1>
        {children}
      </main>

      <footer style={{ borderTop: `1px solid ${c.line}`, background: "#fff", padding: "28px 16px", fontSize: 13, color: c.muted }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "10px 24px", justifyContent: "space-between" }}>
          <span>© Zefir Canada · Edmonton &amp; Leduc, Alberta</span>
          <span style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: c.muted }}>Instagram {INSTAGRAM_HANDLE}</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" style={{ color: c.muted }}>Facebook</a>
            <a href={`mailto:${EMAIL}`} style={{ color: c.muted }}>{EMAIL}</a>
            {GOOGLE_REVIEW_URL && <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" style={{ color: c.rose }}>⭐ Review us on Google</a>}
          </span>
        </div>
      </footer>
    </div>
  );
}
