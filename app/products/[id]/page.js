import { notFound } from "next/navigation";
import { PRODUCTS, LOCAL_ONLY_IDS, SITE_URL } from "@/lib/products";

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

  const c = { pink: "#c8737a", dark: "#2d1b1e", muted: "#6b5a5c", line: "#f0e0e0" };

  return (
    <main style={{ minHeight: "100vh", background: "#fff8f8", fontFamily: "'Inter',sans-serif", color: c.dark }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ background: "#fff", borderBottom: `1px solid ${c.line}`, padding: "18px 16px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: c.dark, textDecoration: "none", letterSpacing: 2 }}>
            ZEFIR <span style={{ color: c.pink }}>CANADA</span>
          </a>
          <a href="/" style={{ color: c.pink, fontSize: 14, textDecoration: "none" }}>← Shop all</a>
        </div>
      </header>

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

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Options</h2>
          <ul style={{ margin: "0 0 16px", paddingLeft: 18, fontSize: 14, color: c.muted, lineHeight: 1.8 }}>
            {p.sizes.map((s) => (
              <li key={s.n}>{s.n}{s.d ? ` (${s.d})` : ""} — ${s.p}</li>
            ))}
            <li>Flavors: {p.flavors.join(", ")}</li>
            {p.min && <li>Minimum order: {p.min}</li>}
          </ul>

          <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Delivery</h2>
          <p style={{ fontSize: 14, color: c.muted, lineHeight: 1.7, margin: "0 0 24px" }}>
            {localOnly
              ? "Local delivery in Edmonton & Leduc area or free pickup in Leduc."
              : "Local delivery in Edmonton & Leduc, free pickup in Leduc, or shipping across Canada with Canada Post."}{" "}
            Handmade fresh to order — please allow 3 days.
          </p>

          <a href={`/?product=${p.id}`} style={{ display: "inline-block", background: "#8a3d57", color: "#fff", padding: "14px 32px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Order now
          </a>
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
  );
}
