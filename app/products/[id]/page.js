import { notFound } from "next/navigation";
import { PRODUCTS, LOCAL_ONLY_IDS, SITE_URL, productDetails } from "@/lib/products";
import { REVIEWS } from "@/lib/reviews";
import styles from "@/app/page.module.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const DEFAULT_DESC = "Handmade marshmallow flowers in a gift box. Made fresh to order in Edmonton, AB.";

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function priceInfo(p) {
  const prices = p.sizes.map((s) => s.p);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return {};
  const { min } = priceInfo(p);
  const localOnly = LOCAL_ONLY_IDS.includes(p.id);
  const where = localOnly ? "Local delivery in Edmonton & Leduc or pickup" : "Local delivery in Edmonton & Leduc, shipping across Canada";
  const title = `${p.name} — Marshmallow Flowers from $${min} | Zefir Canada`;
  const description = `${p.desc || DEFAULT_DESC} ${where}.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/products/${p.id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${p.id}`,
      images: p.image ? [{ url: `${SITE_URL}${p.image}` }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();

  const { min, max } = priceInfo(p);
  const localOnly = LOCAL_ONLY_IDS.includes(p.id);
  const others = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);
  const d = productDetails(p);
  const h2 = { fontSize: 13, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px", color: "#1C1A18" };
  const ul = { margin: "0 0 20px", paddingLeft: 18, fontSize: 14, color: "#5F5E5A", lineHeight: 1.8 };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.desc || DEFAULT_DESC,
    image: p.image ? `${SITE_URL}${p.image}` : undefined,
    brand: { "@type": "Brand", name: "Zefir Canada" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CAD",
      lowPrice: min,
      highPrice: max,
      offerCount: p.sizes.length,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/products/${p.id}`,
    },
  };

  const c = { pink: "#D4537E", dark: "#1C1A18", muted: "#5F5E5A", line: "#E8E5DF" };

  return (
    <div className={styles.wrap}>
    <main style={{ minHeight: "60vh", color: c.dark }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
        <div style={{ background: p.color || "#fff", borderRadius: 14, overflow: "hidden", aspectRatio: "1/1" }}>
          {p.image && <img src={p.image} alt={`${p.name} — handmade marshmallow flowers by Zefir Canada`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        </div>

        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 500, margin: "0 0 8px" }}>{p.name}</h1>
          <p style={{ fontSize: 20, color: c.pink, fontWeight: 600, margin: "0 0 16px" }}>
            {min === max ? `$${min} CAD` : `$${min} – $${max} CAD`}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: c.muted, margin: "0 0 20px" }}>{p.desc || DEFAULT_DESC}</p>

          {d.occasion && <p style={{ fontSize: 15, lineHeight: 1.7, color: c.muted, margin: "0 0 20px" }}>{d.occasion}</p>}

          <h2 style={h2}>Sizes & prices</h2>
          <ul style={ul}>{d.inside.map((t) => <li key={t}>{t}</li>)}</ul>

          <h2 style={h2}>You choose</h2>
          <ul style={ul}>{d.choose.map((t) => <li key={t}>{t}</li>)}</ul>

          <h2 style={h2}>Good to know</h2>
          <ul style={ul}>{d.goodToKnow.map((t) => <li key={t}>{t}</li>)}</ul>

          <a href={`/?product=${p.id}`} style={{ display: "inline-block", background: "#D4537E", color: "#fff", padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Order now
          </a>
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "8px 16px 24px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 500, margin: "0 0 12px" }}>What our customers say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {REVIEWS.map((r) => (
            <div key={r.name} style={{ background: "#fff", border: "1px solid #E8E5DF", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ color: "#D4537E", fontSize: 13, marginBottom: 6 }}>★★★★★</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5F5E5A", margin: "0 0 8px" }}>&ldquo;{r.text}&rdquo;</p>
              <div style={{ fontSize: 13, fontWeight: 600 }}>— {r.name}{r.translated && <span style={{ fontWeight: 400, fontSize: 11, color: "#888780" }}> · translated from Ukrainian</span>}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "8px 16px 48px" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 500 }}>You may also like</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 16 }}>
          {others.map((o) => (
            <a key={o.id} href={`/products/${o.id}`} style={{ textDecoration: "none", color: c.dark }}>
              <div style={{ background: o.color, borderRadius: 10, overflow: "hidden", aspectRatio: "1/1" }}>
                {o.image && <img src={o.image} alt={o.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
              </div>
              <div style={{ fontSize: 14, marginTop: 6 }}>{o.name}</div>
            </a>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter />
    </div>
  );
}
