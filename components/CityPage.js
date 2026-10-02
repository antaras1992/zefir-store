import InfoPage, { H2, P, List, Button, c } from "@/components/InfoPage";
import { PRODUCTS } from "@/lib/products";
import { INSTAGRAM_URL } from "@/lib/site";

function fromPrice(p) {
  return Math.min(...p.sizes.map((s) => s.p));
}

export default function CityPage({ city, intro, delivery, areas, faq }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <InfoPage eyebrow={`${city}, Alberta`} title={`Marshmallow Flower Bouquets in ${city}`} jsonLd={jsonLd}>
      {intro.map((t, i) => <P key={i}>{t}</P>)}

      <H2>Delivery & pickup in {city}</H2>
      <List items={delivery} />
      {areas && <P>We deliver to: {areas}.</P>}

      <H2>Popular gifts</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, margin: "8px 0 20px" }}>
        {PRODUCTS.map((p) => (
          <a key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none", color: c.dark }}>
            <div style={{ background: p.color, borderRadius: 10, overflow: "hidden", aspectRatio: "1/1" }}>
              {p.image && <img src={p.image} alt={`${p.name} — marshmallow flowers, ${city}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </div>
            <div style={{ fontSize: 14, marginTop: 6 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: c.rose }}>from ${fromPrice(p)}</div>
          </a>
        ))}
      </div>

      <H2>Questions from {city} customers</H2>
      {faq.map((f) => (
        <div key={f.q}>
          <p style={{ fontWeight: 600, margin: "16px 0 6px", fontSize: 15 }}>{f.q}</p>
          <P>{f.a}</P>
        </div>
      ))}

      <Button href="/">Order online</Button>
      <Button href="/gallery">See our work</Button>
      <Button href={INSTAGRAM_URL} external>Custom order on Instagram</Button>
    </InfoPage>
  );
}
