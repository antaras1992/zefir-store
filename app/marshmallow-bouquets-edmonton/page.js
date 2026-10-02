import CityPage from "@/components/CityPage";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Marshmallow Bouquets Edmonton — Edible Flower Gifts, Local Delivery | Zefir Canada",
  description: "Handmade marshmallow (zefir) flower bouquets and gift boxes delivered in Edmonton. Birthdays, anniversaries, Mother's Day, corporate gifts. Free delivery on orders $100+.",
  alternates: { canonical: `${SITE_URL}/marshmallow-bouquets-edmonton` },
};

export default function EdmontonPage() {
  return (
    <CityPage
      city="Edmonton"
      intro={[
        "Looking for a gift that looks like real flowers but can be eaten? Our marshmallow (zefir) bouquets are hand-piped petal by petal and delivered fresh across Edmonton.",
        "Each bouquet, basket and gift box is made to order — tulips, roses, peonies and mixed arrangements in the colours you choose. A sweet alternative to fresh flowers for birthdays, anniversaries, Valentine's Day, Mother's Day, weddings and corporate gifts.",
      ]}
      delivery={[
        "Local delivery in Edmonton & area — $25, free on orders $100+",
        "Free pickup in Leduc (about 30 minutes from downtown Edmonton)",
        "Delivery 7 days a week",
        "Please order at least 3 days ahead — everything is handmade fresh",
      ]}
      areas="all Edmonton neighbourhoods, plus Beaumont, Devon and Nisku"
      faq={[
        { q: "Do you deliver marshmallow bouquets in Edmonton?", a: "Yes. We deliver bouquets, baskets and gift boxes across Edmonton for $25, and delivery is free on orders of $100 or more." },
        { q: "Can I order a bouquet for a specific date?", a: "Yes — choose the date in the cart. Please allow at least 3 days for handcrafting." },
        { q: "How long do marshmallow flowers last?", a: "Up to 3 weeks at room temperature, away from direct sunlight, heat and humidity." },
        { q: "Can I get custom colours or a bigger bouquet?", a: "Yes, message us on Instagram with your idea, date and budget. Please allow at least 1 week for custom orders." },
      ]}
    />
  );
}
