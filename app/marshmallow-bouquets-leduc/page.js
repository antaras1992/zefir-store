import CityPage from "@/components/CityPage";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Marshmallow Bouquets Leduc — Free Delivery & Pickup | Zefir Canada",
  description: "Handmade marshmallow (zefir) flower bouquets and gift boxes made in Leduc, Alberta. Free delivery in Leduc and free pickup. Order online for birthdays and special days.",
  alternates: { canonical: `${SITE_URL}/marshmallow-bouquets-leduc` },
};

export default function LeducPage() {
  return (
    <CityPage
      city="Leduc"
      intro={[
        "Zefir Canada is a small family business right here in Leduc. We hand-pipe marshmallow (zefir) flowers and arrange them into edible bouquets, baskets and gift boxes.",
        "They look like real tulips, roses and peonies — and they taste light, fruity and airy. A beautiful local gift for birthdays, anniversaries, teachers, coworkers and every special day.",
      ]}
      delivery={[
        "Delivery in Leduc — always free",
        "Free pickup in Leduc",
        "Nisku is included in our Leduc delivery area",
        "Please order at least 3 days ahead — everything is handmade fresh",
      ]}
      faq={[
        { q: "Is delivery in Leduc really free?", a: "Yes, delivery anywhere in Leduc (including Nisku) is always free, no minimum order." },
        { q: "Can I pick up my order?", a: "Yes, pickup in Leduc is free. Choose \"Pickup in Leduc\" in the cart." },
        { q: "How far ahead should I order?", a: "At least 3 days for standard orders and about 1 week for custom designs." },
        { q: "What are marshmallow flowers made of?", a: "Fruit & berry purée, sugar, agar-agar, albumin (dried egg white) and food colouring. Made without gluten, dairy or nuts." },
      ]}
    />
  );
}
