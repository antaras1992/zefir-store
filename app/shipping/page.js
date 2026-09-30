import InfoPage, { H2, P, List, Button } from "@/components/InfoPage";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Shipping & Delivery — Edmonton, Leduc & Canada | Zefir Canada",
  description: "Local delivery of marshmallow bouquets in Edmonton & Leduc, free pickup in Leduc, and Canada Post shipping for gift boxes across Canada.",
  alternates: { canonical: `${SITE_URL}/shipping` },
};

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="Delivery" title="Shipping & delivery">
      <H2>Edmonton & Leduc area</H2>
      <List items={[
        "Local delivery in Edmonton & Leduc area — free on orders $100+",
        "Free pickup in Leduc",
        "Local delivery available 7 days a week",
        "Please allow 3 days for handcrafting",
      ]} />

      <H2>Shipping across Canada</H2>
      <List items={[
        "Tulip gift boxes and single tulips ship across Canada with Canada Post",
        "Bouquets and baskets are local delivery or pickup only (they are too fragile to ship)",
        "Shipping price and delivery time are calculated in the cart by postal code",
        "Please allow 3 business days for handcrafting plus Canada Post delivery time",
      ]} />

      <H2>Ordering for a birthday or special date?</H2>
      <P>We ship early so your gift arrives on or before the date you choose. It may arrive 1–3 days early — our marshmallow flowers stay fresh, so it&apos;s perfect to keep until the big day. Canada Post delivery times are estimates and delays are outside our control, so please order with extra time.</P>

      <Button href="/">Shop now</Button>
    </InfoPage>
  );
}
