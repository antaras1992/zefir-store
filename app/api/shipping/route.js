// Canada Post shipping — CORRECT endpoints (Developer Portal, JSON, OAuth 2.0)
// Falls back to weight+zone estimate if Canada Post is unavailable.

const WEIGHTS = {
  "tulip-box-4": 0.3, "tulip-box-10": 0.6, "tulip-box-12": 0.7, "tulip-box-20": 1.0,
  "tulip-bouquet": 0.7, "mixed-bouquet": 0.7, "single-tulip": 0.1, "flower-basket": 0.8,
};

const LOCAL_PREFIXES = ["T5", "T6", "T9E", "T8"];

const ZONE_BY_LETTER = {
  T: 1, S: 1, R: 1, V: 2, P: 2, N: 2, L: 2, K: 2, M: 2,
  H: 3, J: 3, G: 3, E: 3, B: 3, C: 3, A: 3, X: 3, Y: 3,
};
const ZONE_RATES = { 1: { base: 12, perKg: 3 }, 2: { base: 16, perKg: 5 }, 3: { base: 20, perKg: 7 } };

// Correct Canada Post endpoints (from Rating 4.0.0 API reference)
const CP_BASE = "https://api.canadapost-postescanada.ca/prod/devportal-portaildesdeveloppeurs";
const CP_TOKEN_URL = `${CP_BASE}/cpc-api-native-oauth-provider/oauth2/token`;
const CP_RATES_URL = `${CP_BASE}/rating/v1/prices`;

function getItemWeight(item) {
  return (WEIGHTS[item.id] || 0.5) * item.qty;
}

async function getCanadaPostToken() {
  const key = process.env.CANADA_POST_API_USER;
  const secret = process.env.CANADA_POST_API_PASSWORD;
  if (!key || !secret) return null;

  const res = await fetch(CP_TOKEN_URL, {
    method: "POST",
    headers: {
      "X-IBM-Client-Id": key,
      "X-IBM-Client-Secret": secret,
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "scope=merchant&grant_type=client_credentials",
  });

  if (!res.ok) {
    console.error("Canada Post token error:", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return data.access_token || null;
}

async function getCanadaPostRates(token, weightKg, origin, dest) {
  const customer = process.env.CANADA_POST_CUSTOMER;

  const body = {
    customerNumber: customer,
    quoteType: "commercial",
    parcelCharacteristics: { weight: weightKg },
    originPostalCode: origin,
    destination: { domestic: { postalCode: dest } },
  };

  const res = await fetch(CP_RATES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Canada Post rates error:", res.status, text);
    return null;
  }

  try {
    const data = JSON.parse(text);
    const list = Array.isArray(data) ? data : [];
    return list
      .map((q) => ({
        id: "cp-" + String(q.serviceCode || "svc").toLowerCase().replace(/\./g, "-"),
        name: q.serviceName || q.serviceCode || "Canada Post",
        price: parseFloat(q.priceDetails?.due || 0),
        eta: q.serviceStandard?.expectedTransitTime
          ? `${q.serviceStandard.expectedTransitTime} business days`
          : "Canada Post",
      }))
      .filter((o) => o.price > 0);
  } catch (e) {
    console.error("Canada Post parse error:", e, text);
    return null;
  }
}

export async function POST(request) {
  try {
    const { items, postalCode } = await request.json();
    if (!items || items.length === 0) return Response.json({ error: "Cart is empty" }, { status: 400 });
    if (!postalCode) return Response.json({ error: "Postal code required" }, { status: 400 });

    const dest = postalCode.replace(/\s+/g, "").toUpperCase();
    const prefix2 = dest.slice(0, 2);
    const prefix3 = dest.slice(0, 3);
    const firstLetter = dest.slice(0, 1);

    const totalWeight = items.reduce((s, i) => s + getItemWeight(i), 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const weightKg = Math.max(0.1, Math.round(totalWeight * 1000) / 1000);

    const options = [];
    options.push({ id: "pickup", name: "Pickup in Leduc", price: 0, eta: "Ready in 3 days" });

    const isLocal = LOCAL_PREFIXES.some((p) => prefix2 === p || prefix3 === p);
    if (isLocal) {
      options.push({
        id: "local",
        name: "Local Delivery (Edmonton & Leduc)",
        price: subtotal >= 90 ? 0 : 15,
        eta: "Within 3 days",
      });
      return Response.json({ options, weight: weightKg, source: "local" });
    }

    // Try Canada Post real rates
    const origin = (process.env.CANADA_POST_ORIGIN || "T9E0A0").replace(/\s+/g, "").toUpperCase();
    let cpOptions = null;
    try {
      const token = await getCanadaPostToken();
      if (token) cpOptions = await getCanadaPostRates(token, weightKg, origin, dest);
    } catch (e) {
      console.error("Canada Post flow failed:", e);
    }

    if (cpOptions && cpOptions.length > 0) {
      cpOptions.forEach((o) => options.push(o));
      return Response.json({ options, weight: weightKg, source: "canada-post" });
    }

    // Fallback estimate
    const zone = ZONE_BY_LETTER[firstLetter] || 3;
    const rate = ZONE_RATES[zone];
    const shipCost = Math.round((rate.base + rate.perKg * weightKg) * 100) / 100;
    const etaByZone = { 1: "2–4 business days", 2: "3–6 business days", 3: "5–9 business days" };
    options.push({ id: "canada-post-est", name: "Canada Post Shipping", price: shipCost, eta: etaByZone[zone] });

    return Response.json({ options, weight: weightKg, source: "estimate" });
  } catch (err) {
    console.error("Shipping error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}