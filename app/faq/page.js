import InfoPage, { H2, P, Button } from "@/components/InfoPage";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "FAQ — Ingredients, Allergens, Storage & Ordering | Zefir Canada",
  description: "What are marshmallow (zefir) flowers made of? Ingredients, allergens, how long they last, delivery and custom orders — answers from Zefir Canada in Edmonton & Leduc.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

const FAQ = [
  { q: "What is zefir?", a: "Zefir is a traditional Eastern European marshmallow — light, airy and fruity. We hand-pipe it into realistic flowers and arrange them into edible bouquets and gift boxes." },
  { q: "What are your marshmallow flowers made of?", a: "Fruit & berry purée, sugar, agar-agar (a plant-based gelling agent from seaweed), egg white protein (albumin) and food colouring." },
  { q: "What allergens do they contain?", a: "Our marshmallow flowers contain egg. They are made without gluten, dairy and nuts. If you have a severe allergy, please message us before ordering." },
  { q: "Are they gluten-free, dairy-free and fat-free?", a: "Our zefir recipe has no flour, no milk or butter and no added fat." },
  { q: "How long do marshmallow bouquets last?", a: "Up to 3 weeks at room temperature. Keep them away from direct sunlight, heat and humidity." },
  { q: "Can I customize my bouquet?", a: `Yes! For special colours, sizes or designs, message us on Instagram ${INSTAGRAM_HANDLE}. Please allow at least 1 week for custom orders.` },
  { q: "How far in advance should I order?", a: "At least 3 days for local orders. For shipping across Canada allow 3 business days plus Canada Post delivery time." },
  { q: "Do you deliver on weekends?", a: "Yes, local delivery is available 7 days a week in the Edmonton & Leduc area." },
  { q: "Can you ship bouquets across Canada?", a: "Bouquets and baskets are local delivery or pickup only. Tulip gift boxes and single tulips ship across Canada with Canada Post." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
  return (
    <InfoPage eyebrow="Help" title="Frequently asked questions" jsonLd={jsonLd}>
      {FAQ.map((f) => (
        <div key={f.q}>
          <H2>{f.q}</H2>
          <P>{f.a}</P>
        </div>
      ))}
      <Button href={INSTAGRAM_URL} external>Ask us on Instagram</Button>
      <Button href="/">Shop now</Button>
    </InfoPage>
  );
}
