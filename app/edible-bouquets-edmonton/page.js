import CityPage from "@/components/CityPage";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Edible Bouquets Edmonton — Marshmallow Flower Bouquets Delivered | Zefir Canada",
  description: "Edible bouquets in Edmonton made of handmade marshmallow flowers — tulips, roses and peonies you can eat. Local delivery in Edmonton, free on orders $100+, free in Leduc.",
  alternates: { canonical: `${SITE_URL}/edible-bouquets-edmonton` },
};

export default function EdibleBouquetsEdmontonPage() {
  return (
    <CityPage
      city="Edmonton"
      title="Edible Bouquets in Edmonton"
      deliveryTitle="Edible bouquet delivery in Edmonton"
      intro={[
        "Want an edible bouquet that is more than fruit on sticks? Our bouquets are made of handmade marshmallow (zefir) flowers — tulips, roses and peonies piped petal by petal from fruit purée. They look like real flowers and taste like a light, airy dessert.",
        "Every edible bouquet is made to order in Leduc and delivered across Edmonton. A sweet alternative to fresh flowers and fruit arrangements for birthdays, anniversaries, Mother's Day, Valentine's Day, thank-you gifts and corporate events.",
        "Unlike fruit bouquets, marshmallow flowers don't need the fridge and stay fresh up to 3 weeks at room temperature — so the gift can be enjoyed for days, not hours.",
      ]}
      delivery={[
        "Edible bouquet delivery across Edmonton — $25, free on orders $100+",
        "Free delivery in Leduc and free pickup in Leduc",
        "Pick your delivery date in the cart",
        "Please order at least 3 days ahead — every bouquet is handmade fresh",
      ]}
      areas="all Edmonton neighbourhoods, plus Beaumont, Devon and Nisku"
      faq={[
        { q: "What is an edible marshmallow bouquet?", a: "It is a bouquet of flowers made entirely from marshmallow (zefir) — fruit & berry purée whipped with sugar, agar-agar and albumin (dried egg white). Every flower is edible. Contains egg (albumin)." },
        { q: "How is it different from a fruit bouquet?", a: "Fruit bouquets need refrigeration and should be eaten the same day. Marshmallow flower bouquets keep up to 3 weeks at room temperature and look like real flowers." },
        { q: "Do you deliver edible bouquets in Edmonton?", a: "Yes. Delivery across Edmonton is $25 and free on orders of $100 or more. Delivery in Leduc is always free." },
        { q: "Can I add a card message?", a: "Yes — add your card message in the cart and we will include it with the bouquet." },
        { q: "Can I order custom colours?", a: "Yes, message us on Instagram with your idea, date and budget. Please allow at least 1 week for custom orders." },
      ]}
    />
  );
}
