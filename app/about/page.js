import InfoPage, { H2, P, List, Button, ReviewButton } from "@/components/InfoPage";
import { INSTAGRAM_URL, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "About Us — Handmade Marshmallow Flowers in Edmonton & Leduc | Zefir Canada",
  description: "Zefir Canada is a small family business in Leduc, Alberta making hand-piped marshmallow (zefir) flower bouquets and gift boxes from fruit purée, agar-agar and egg white.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <InfoPage eyebrow="Our story" title="Made by hand, made with care">
      <P>Zefir Canada started with a simple idea: a gift that&apos;s both beautiful and delicious. We are a small family business from Leduc, Alberta, and every marshmallow flower is hand-piped in our kitchen using natural food colours and quality ingredients.</P>
      <P>Zefir is a traditional Eastern European marshmallow — light, airy and fruity. We shape it petal by petal into tulips, roses, peonies and other flowers, then arrange them into bouquets, baskets and gift boxes that look like real flowers but can be eaten.</P>

      <H2>Why people love our zefir flowers</H2>
      <List items={[
        "Handmade fresh to order — never from a shelf",
        "Made from fruit & berry purée, sugar, agar-agar and egg white",
        "Made without gluten, dairy, nuts or added fat",
        "Gift-ready packaging included",
        "Local delivery in Edmonton & Leduc, free pickup in Leduc, shipping across Canada for gift boxes",
      ]} />

      <H2>Custom orders</H2>
      <P>Want special colours, a bigger arrangement or a design for a wedding, baby shower or corporate event? Send us a message on Instagram — we&apos;ll create something just for you.</P>
      <Button href={INSTAGRAM_URL} external>Message us on Instagram</Button>
      <Button href="/">Shop bouquets</Button>
      <ReviewButton />
    </InfoPage>
  );
}
