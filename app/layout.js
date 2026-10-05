const SITE_URL = "https://www.zefircanada.ca";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zefir Canada — Handmade Marshmallow Bouquets | Edmonton & Leduc",
  description: "Handmade marshmallow (zefir) flower bouquets & gift boxes from Leduc, AB. Free Leduc delivery, Edmonton delivery, gift boxes shipped across Canada.",
  keywords: ["marshmallow bouquet", "marshmallow flowers", "zefir", "edible bouquet", "birthday gift Edmonton", "gift box Leduc", "marshmallow bouquet Canada"],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Zefir Canada — Handmade Marshmallow Bouquets",
    description: "Edible marshmallow flower bouquets & gift boxes, handmade in Edmonton. Local delivery, pickup and Canada-wide shipping.",
    url: SITE_URL,
    siteName: "Zefir Canada",
    images: [{ url: "/hero.jpg" }],
    locale: "en_CA",
    type: "website",
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Zefir Canada",
  description: "Handmade marshmallow (zefir) flower bouquets and gift boxes, made to order in Leduc, Alberta. Local delivery in Edmonton & Leduc, gift boxes shipped across Canada.",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  email: "nataliyakhemii@icloud.com",
  hasMap: "https://www.google.com/maps/place/Zefir+Canada/data=!4m2!3m1!1s0x44cb1a74e91b3b7b:0x7307273c4c6a8298",
  servesCuisine: "Desserts",
  image: `${SITE_URL}/hero.jpg`,
  priceRange: "$$",
  address: { "@type": "PostalAddress", addressLocality: "Leduc", addressRegion: "AB", addressCountry: "CA" },
  sameAs: [
    "https://www.instagram.com/handmade_zefir_canada",
    "https://www.facebook.com/share/1FeZwWCENb/",
  ],
  areaServed: [
    { "@type": "City", name: "Edmonton" },
    { "@type": "City", name: "Leduc" },
    { "@type": "Country", name: "Canada" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
