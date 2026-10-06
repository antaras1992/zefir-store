import { GOOGLE_REVIEW_URL } from "@/lib/site";
import styles from "@/app/page.module.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const c = { pink: "#c8737a", rose: "#D4537E", dark: "#1C1A18", muted: "#5F5E5A", line: "#E8E5DF", bg: "#FAF8F5" };

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

export default function InfoPage({ eyebrow, title, children, jsonLd, decor }) {
  return (
    <div className={styles.wrap} style={{ minHeight: "100vh" }}>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <SiteHeader />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 64px", position: "relative" }}>
        {decor}
        {eyebrow && <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: c.rose, marginBottom: 8 }}>{eyebrow}</div>}
        <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(32px,6vw,44px)", fontWeight: 500, margin: "0 0 20px", lineHeight: 1.15 }}>{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
