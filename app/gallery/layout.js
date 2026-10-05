const SITE_URL = "https://www.zefircanada.ca";

export const metadata = {
  title: "Gallery — Marshmallow Bouquets & Gift Boxes We've Made | Zefir Canada",
  description: "Photos of our handmade marshmallow (zefir) flower bouquets, baskets and gift boxes. Pick a design by its number and order it in Edmonton & Leduc.",
  alternates: { canonical: `${SITE_URL}/gallery` },
  openGraph: {
    title: "Zefir Canada — Gallery of marshmallow bouquets",
    description: "Handmade marshmallow flower bouquets and gift boxes. Choose a design by number.",
    url: `${SITE_URL}/gallery`,
    images: [{ url: "/hero.jpg" }],
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
