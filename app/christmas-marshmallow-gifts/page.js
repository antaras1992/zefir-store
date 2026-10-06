import InfoPage, { H2, P, List, Button, c } from "@/components/InfoPage";
import { PRODUCTS, LOCAL_ONLY_IDS } from "@/lib/products";
import { SITE_URL, INSTAGRAM_URL } from "@/lib/site";

export const metadata = {
  title: "Christmas Marshmallow Gifts Edmonton — Edible Flower Bouquets & Gift Boxes | Zefir Canada",
  description: "Handmade Christmas gifts from marshmallow flowers: bouquets, tulip gift boxes and corporate gifts. Delivery in Edmonton & Leduc, gift boxes shipped across Canada.",
  alternates: { canonical: `${SITE_URL}/christmas-marshmallow-gifts` },
};

const GIFTS = [
  { id: "tulip-box-10", why: "Easy gift for teachers, coworkers and neighbours" },
  { id: "tulip-box-20", why: "A generous box for family — ships across Canada" },
  { id: "mixed-bouquet", why: "The wow gift for Christmas Eve dinner (Edmonton & Leduc)" },
  { id: "single-tulip", why: "Stocking stuffers & corporate favours (min. 20 pcs)" },
];

const FAQ = [
  { q: "When should I order for Christmas?", a: "As early as possible — December is our busiest month and we make every order by hand. For local delivery please order at least 3 days ahead; for Canada Post shipping allow 3 business days plus delivery time, and expect holiday delays." },
  { q: "Can you make Christmas colours?", a: "Yes — red, white, green, gold or any palette you like. Choose colours in the cart or message us on Instagram for a custom design." },
  { q: "Do you do corporate Christmas gifts?", a: "Yes. Individual tulips (from 20 pcs) and tulip boxes are perfect for clients and teams. Message us with quantity and date and we'll prepare a quote." },
  { q: "Can you ship Christmas gifts to family in another province?", a: "Yes — tulip gift boxes ship anywhere in Canada with Canada Post. Bouquets and baskets are local only (Edmonton & Leduc)." },
  { q: "How long do marshmallow flowers last?", a: "Up to 3 weeks at room temperature, away from sun, heat and humidity — so they can be bought a few days before the holidays." },
];

export default function ChristmasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const gifts = GIFTS.map((g) => ({ ...g, p: PRODUCTS.find((x) => x.id === g.id) })).filter((g) => g.p);

  return (
    <InfoPage eyebrow="Christmas 2026 🎄" title="Christmas Gifts Made of Marshmallow Flowers" jsonLd={jsonLd}>
      <P>Looking for a Christmas gift that is handmade, beautiful and actually gets eaten? Our marshmallow (zefir) flowers are hand-piped petal by petal from fruit &amp; berry purée — they look like real flowers and taste like a light, airy dessert.</P>
      <P>Order bouquets and gift boxes in festive red, white, green and gold — delivered in Edmonton &amp; Leduc, or shipped across Canada to family far away.</P>

      <Button href="/?shop=all">Shop Christmas gifts</Button>
      <Button href={INSTAGRAM_URL} external>Custom Christmas order</Button>

      <H2>Gift ideas</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14, margin: "8px 0 20px" }}>
        {gifts.map(({ id, why, p }) => (
          <a key={id} href={`/products/${id}`} style={{ textDecoration: "none", color: c.dark }}>
            <div style={{ background: p.color, borderRadius: 10, overflow: "hidden", aspectRatio: "1/1" }}>
              <img src={p.image} alt={`${p.name} — Christmas marshmallow flower gift`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ fontSize: 14, marginTop: 6 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: c.rose }}>from ${Math.min(...p.sizes.map((s) => s.p))}{LOCAL_ONLY_IDS.includes(id) ? " · local" : ""}</div>
            <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{why}</div>
          </a>
        ))}
      </div>

      <H2>Corporate Christmas gifts</H2>
      <P>Thank your clients and team with something memorable. We make individual tulips in branded colours (from 20 pcs) and tulip gift boxes for offices in Edmonton, Leduc and Nisku.</P>
      <List items={[
        "Individual wrapped tulips — from $3 each, min. 20 pcs",
        "Tulip boxes of 10 or 20 — ship across Canada",
        "Custom colours to match your brand",
        "Card message included",
      ]} />
      <Button href={INSTAGRAM_URL} external>Ask for a corporate quote</Button>

      <H2>Order early for Christmas</H2>
      <List items={[
        "Local delivery in Edmonton & area — $25, free on orders $100+",
        "Delivery in Leduc and pickup in Leduc — free",
        "Please order at least 3 days ahead; December fills up fast",
        "Canada-wide shipping: allow 3 business days + Canada Post time, plus holiday delays",
      ]} />

      <H2>Christmas FAQ</H2>
      {FAQ.map((f) => (
        <div key={f.q}>
          <p style={{ fontWeight: 600, margin: "16px 0 6px", fontSize: 15 }}>{f.q}</p>
          <P>{f.a}</P>
        </div>
      ))}

      <Button href="/?shop=all">Order online</Button>
      <Button href="/gallery">See our work</Button>
    </InfoPage>
  );
}
