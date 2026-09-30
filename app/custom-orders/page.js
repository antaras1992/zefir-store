import InfoPage, { H2, P, List, Button } from "@/components/InfoPage";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, EMAIL, SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Custom Marshmallow Bouquets & Gift Orders | Zefir Canada — Edmonton",
  description: "Order a custom marshmallow flower bouquet or gift box in Edmonton & Leduc: your colours, flavours, size and message. Weddings, birthdays, baby showers, corporate gifts.",
  alternates: { canonical: `${SITE_URL}/custom-orders` },
};

export default function CustomOrdersPage() {
  return (
    <InfoPage eyebrow="Made just for you" title="Custom marshmallow bouquets & gifts">
      <P>Can&apos;t find exactly what you need in the shop? We make custom zefir flower arrangements for any occasion.</P>

      <H2>What we can make</H2>
      <List items={[
        "Your choice of colours to match a theme or party décor",
        "Bigger or smaller bouquets and baskets",
        "Mixed flowers: tulips, roses, peonies, ranunculus, hydrangeas and more",
        "Party favours and gift boxes in bulk — weddings, baby showers, corporate gifts",
        "Personal message cards",
      ]} />

      <H2>How to order</H2>
      <List items={[
        `Send us a direct message on Instagram ${INSTAGRAM_HANDLE} (or email ${EMAIL})`,
        "Tell us the date, occasion, colours, size and budget — photos of ideas help",
        "We reply within 24 hours with a price and details",
        "Please allow at least 1 week for custom orders",
      ]} />

      <Button href={INSTAGRAM_URL} external>📸 Message us on Instagram</Button>
      <Button href={`mailto:${EMAIL}`}>✉️ Email us</Button>
    </InfoPage>
  );
}
