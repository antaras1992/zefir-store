// Product catalog — shared by the shop (app/page.js) and SEO pages (app/products/[id])
export const PRODUCTS = [
  { id: "tulip-bouquet", cat: "bouquets", name: "Tulip Bouquet", badge: "Bestseller", featured: true,
    desc: "Hand-piped marshmallow tulips arranged into a beautiful edible bouquet. Made fresh to order in our Edmonton kitchen.",
  color: "#FBEAF0", flower: "tulip", selectColor: true, image: "/tulip-bouquet.jpg",
    sizes: [{ n: "S", d: "~15 cm", p: 50 }, { n: "M", d: "~20 cm", p: 70 }, { n: "L", d: "~30 cm", p: 90 }],
    flavors: ["Strawberry", "Apple"], card: true },
  { id: "mixed-bouquet", cat: "bouquets", name: "Mixed Flower Bouquet", badge: "Premium", featured: true,
    desc: "A stunning mix of marshmallow flowers in different shapes and colors. Our most impressive arrangement.",
   color: "#FAECE7", flower: "mixed", image: "/mixed-bouquet.jpg", flowerTypes: ["Tulip","Peony","Rose","Ranunculus","Hydrangea","Dahlia","Chrysanthemum"],
    sizes: [{ n: "S", d: "~15 cm", p: 70 }, { n: "M", d: "~20 cm", p: 90 }, { n: "L", d: "~30 cm", p: 120 }],
    flavors: ["Strawberry", "Apple"], card: true },
  { id: "tulip-box-4", cat: "boxes", name: "Tulip Box — 4 pieces", badge: "Min. 4 boxes", featured: false,
color: "#F5F0FC", flower: "box", selectColor: true, image: "/tulip-box-4.jpg",
      sizes: [{ n: "Clear box", d: "4 pieces", p: 12 }], flavors: ["Strawberry", "Apple"], card: true, min: 4 },
    { id: "tulip-box-10", cat: "boxes", name: "Tulip Box — 10 pieces", badge: "", featured: true,
    desc: "Ten marshmallow tulips beautifully arranged in a clear gift box.",
    color: "#FBEAF0", flower: "box", selectColor: true, image: "/tulip-box-10.jpg",
    sizes: [{ n: "Clear box", d: "10 pieces", p: 35 }], flavors: ["Strawberry", "Apple"], card: true },
  { id: "tulip-box-12", cat: "boxes", name: "Tulip Box — 12 pieces", badge: "", featured: false,
    desc: "A dozen marshmallow tulips in an elegant white gift box.",
    color: "#FAFAF8", flower: "box", selectColor: true, image: "/tulip-box-12.jpg",
    sizes: [{ n: "White box", d: "12 pieces", p: 35 }], flavors: ["Strawberry", "Apple"], card: true },
  { id: "tulip-box-20", cat: "boxes", name: "Tulip Box — 20 pieces", badge: "Best value", featured: false,
    desc: "Twenty marshmallow tulips — a generous gift box for someone special.",
    color: "#FAECE7", flower: "box", selectColor: true, image: "/tulip-box-20.jpg",
    sizes: [{ n: "Gift box", d: "20 pieces", p: 50 }], flavors: ["Strawberry", "Apple"], card: true },
  { id: "single-tulip", cat: "extras", name: "Individual Tulip Flower", badge: "Min. 20 pcs", featured: false,
    desc: "A single marshmallow tulip in its own packaging. Great as a favour or add-on.",
    color: "#F5F0FC", flower: "single", selectColor: true, image: "/single-tulip.jpg",
    sizes: [{ n: "Single", d: "1 flower", p: 3 }], flavors: ["Strawberry", "Apple"], card: false, min: 20 },
  { id: "flower-basket", cat: "extras", name: "Flower Basket", badge: "", featured: false,
    desc: "Marshmallow flowers arranged in a charming basket. A unique gift that stands out.",
    color: "#FBEAF0", flower: "basket", flowerTypes: ["Tulip","Peony","Rose","Ranunculus","Hydrangea","Dahlia","Chrysanthemum"], image: "/flower-basket.jpg",
    sizes: [{ n: "Basket", d: "One size", p: 50 }], flavors: ["Strawberry", "Apple"], card: true },
];

// Bouquets & baskets are local delivery / pickup only
export const LOCAL_ONLY_IDS = ["tulip-bouquet", "mixed-bouquet", "flower-basket"];

export const SITE_URL = "https://www.zefircanada.ca";

// Extra product info built only from real product data (sizes, flavours, options)
const OCCASIONS = {
  "tulip-bouquet": "A classic for birthdays, anniversaries, Mother's Day and \"just because\".",
  "mixed-bouquet": "Perfect for milestone birthdays, anniversaries and weddings.",
  "tulip-box-4": "Great as party favours, guest gifts at weddings and baby showers, or corporate gifts.",
  "tulip-box-10": "A sweet thank-you gift for teachers, coworkers, hosts and friends.",
  "tulip-box-12": "A dozen tulips that never wilt — a lovely birthday or thank-you gift.",
  "tulip-box-20": "A generous gift box to share — for family celebrations and special people.",
  "single-tulip": "Perfect as party favours and guest gifts for weddings, baby showers, birthdays and corporate events.",
  "flower-basket": "A unique centrepiece gift for birthdays, housewarmings and celebrations.",
};

export function productDetails(p) {
  const inside = p.sizes.map((s) =>
    s.n === "Single" || s.n === "Basket" ? `${s.d} — $${s.p}` : `${s.n}${s.d ? ` (${s.d})` : ""} — $${s.p}`
  );
  const choose = [`Flavour: ${p.flavors.join(", ")}`];
  if (p.selectColor) choose.push("Colour: white, yellow, pink, purple, blue or red");
  if (p.flowerTypes) choose.push(`Flowers: ${p.flowerTypes.join(", ")} — in your colours`);
  if (p.card) choose.push("Optional greeting card with your message (+$5)");
  if (p.min) choose.push(`Minimum order: ${p.min} ${p.id === "single-tulip" ? "pieces" : "boxes"}`);
  const localOnly = LOCAL_ONLY_IDS.includes(p.id);
  return {
    occasion: OCCASIONS[p.id] || "",
    inside,
    choose,
    goodToKnow: [
      "Handmade fresh to order — please allow 3 days",
      "Made from fruit & berry purée, sugar, agar-agar, albumin (dried egg white) and food colouring",
      "Allergen: egg (albumin) · made without gluten, dairy and nuts",
      "Stays fresh up to 3 weeks at room temperature, away from sun, heat and humidity",
      localOnly
        ? "Local delivery in Edmonton & Leduc or free pickup in Leduc (not shipped)"
        : "Local delivery in Edmonton & Leduc, free pickup in Leduc, or Canada Post shipping",
    ],
  };
}
