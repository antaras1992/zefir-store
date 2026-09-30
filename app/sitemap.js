import { PRODUCTS, SITE_URL } from "@/lib/products";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...["about", "custom-orders", "shipping", "faq"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...PRODUCTS.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
