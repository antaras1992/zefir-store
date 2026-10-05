import CityPage from "@/components/CityPage";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Marshmallow Flowers Canada — Gift Boxes Shipped Across Canada | Zefir Canada",
  description: "Handmade marshmallow (zefir) flower gift boxes shipped anywhere in Canada with Canada Post — Ontario, BC, Quebec, Manitoba, Saskatchewan and more. Shipping calculated by postal code.",
  alternates: { canonical: `${SITE_URL}/marshmallow-bouquets-canada` },
};

export default function CanadaPage() {
  return (
    <CityPage
      city="Canada"
      eyebrow="Canada-wide shipping"
      title="Marshmallow Flower Gifts Shipped Across Canada"
      deliveryTitle="Shipping across Canada"
      productIds={["tulip-box-4", "tulip-box-10", "tulip-box-12", "tulip-box-20", "single-tulip"]}
      intro={[
        "Send handmade marshmallow (zefir) flowers to anyone in Canada. Our tulip gift boxes are made fresh to order in Alberta, packed in protective boxes and shipped with Canada Post to every province.",
        "Each tulip is hand-piped from fruit & berry purée, sugar, agar-agar and albumin (dried egg white) — light, airy and naturally coloured. A gift that looks like real flowers, arrives safely by mail and stays fresh up to 3 weeks.",
        "Perfect for long-distance birthdays, anniversaries, Mother's Day, thank-you gifts and corporate gifting for teams in different cities.",
      ]}
      delivery={[
        "Tulip gift boxes and single tulips ship across Canada with Canada Post",
        "Shipping price and delivery time are calculated in the cart by postal code",
        "Protective packaging is included in the shipping price",
        "Please allow 3 business days for handcrafting plus Canada Post delivery time",
        "Bouquets and baskets are local only (Edmonton & Leduc) — too fragile to ship",
      ]}
      areas="Ontario (Toronto, Ottawa, Kingston), British Columbia (Vancouver, Victoria), Alberta (Calgary, Red Deer), Saskatchewan, Manitoba, Quebec, the Maritimes and more"
      faq={[
        { q: "Do you ship marshmallow flowers across Canada?", a: "Yes. Tulip gift boxes and single tulips ship to every province with Canada Post. Enter your postal code in the cart to see the price and delivery time." },
        { q: "Will the marshmallow flowers survive shipping?", a: "Each box is packed in a protective outer box. Marshmallow flowers are shelf-stable and keep up to 3 weeks at room temperature." },
        { q: "Can I ship a gift directly to someone else?", a: "Yes — enter the recipient's address at checkout and add a card message in the cart." },
        { q: "How long does shipping take?", a: "We need 3 business days to make your order, then Canada Post delivery time depends on the service and destination. The cart shows the estimated delivery date." },
        { q: "Can you ship bouquets?", a: "No, bouquets and baskets are too fragile for mail. They are available for local delivery in Edmonton and Leduc or pickup in Leduc." },
      ]}
    />
  );
}
