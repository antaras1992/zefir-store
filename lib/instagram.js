// Instagram → Gallery sync (Instagram API with Instagram Login, business/creator account)
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase";

export const IG_REDIRECT_URI = "https://www.zefircanada.ca/api/instagram/callback";
const GRAPH = "https://graph.instagram.com";
const MAX_NEW_PER_RUN = 25;

// ---------- settings storage ----------
// Stored as JSON files in a PRIVATE Supabase Storage bucket, created automatically (no SQL needed).
const SETTINGS_BUCKET = "app-settings";
let bucketReady = false;

async function ensureBucket(supabase) {
  if (bucketReady) return;
  const { data } = await supabase.storage.getBucket(SETTINGS_BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(SETTINGS_BUCKET, { public: false });
    if (error && !/exist/i.test(error.message)) throw new Error(`Supabase bucket: ${error.message}`);
  }
  bucketReady = true;
}

export async function getSetting(key) {
  const supabase = createServiceClient();
  await ensureBucket(supabase);
  const { data, error } = await supabase.storage.from(SETTINGS_BUCKET).download(`${key}.json`);
  if (error || !data) return null;
  try { return JSON.parse(await data.text()); } catch { return null; }
}

export async function setSetting(key, value) {
  const supabase = createServiceClient();
  await ensureBucket(supabase);
  const { error } = await supabase.storage
    .from(SETTINGS_BUCKET)
    .upload(`${key}.json`, JSON.stringify(value), { contentType: "application/json", upsert: true });
  if (error) throw new Error(`Supabase settings: ${error.message}`);
}

// ---------- auth helpers ----------
export function oauthState() {
  return crypto
    .createHash("sha256")
    .update(`${process.env.GALLERY_ADMIN_PASSWORD}|${process.env.INSTAGRAM_APP_SECRET}`)
    .digest("hex")
    .slice(0, 32);
}

export function isAdmin(password) {
  return Boolean(process.env.GALLERY_ADMIN_PASSWORD) && password === process.env.GALLERY_ADMIN_PASSWORD;
}

// ---------- OAuth ----------
export function authorizeUrl() {
  const p = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID,
    redirect_uri: IG_REDIRECT_URI,
    response_type: "code",
    scope: "instagram_business_basic",
    state: oauthState(),
  });
  return `https://www.instagram.com/oauth/authorize?${p}`;
}

export async function exchangeCode(code) {
  // 1) code -> short-lived token
  const body = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID,
    client_secret: process.env.INSTAGRAM_APP_SECRET,
    grant_type: "authorization_code",
    redirect_uri: IG_REDIRECT_URI,
    code: code.replace(/#_$/, ""),
  });
  const r1 = await fetch("https://api.instagram.com/oauth/access_token", { method: "POST", body });
  const d1 = await r1.json();
  const short = d1.access_token || d1.data?.[0]?.access_token;
  if (!short) throw new Error(`Instagram token exchange failed: ${JSON.stringify(d1)}`);

  // 2) short-lived -> long-lived (60 days)
  const p = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: process.env.INSTAGRAM_APP_SECRET,
    access_token: short,
  });
  const r2 = await fetch(`${GRAPH}/access_token?${p}`);
  const d2 = await r2.json();
  if (!d2.access_token) throw new Error(`Instagram long-lived token failed: ${JSON.stringify(d2)}`);

  const now = Date.now();
  const token = {
    access_token: d2.access_token,
    expires_at: now + (d2.expires_in || 5184000) * 1000,
    refreshed_at: now,
  };
  await setSetting("instagram_token", token);
  return token;
}

async function getFreshToken() {
  const token = await getSetting("instagram_token");
  if (!token?.access_token) throw new Error("Instagram is not connected yet");

  // Refresh every ~7 days (token must be at least 24h old; valid 60 days)
  const age = Date.now() - (token.refreshed_at || 0);
  if (age > 7 * 86400000) {
    const p = new URLSearchParams({ grant_type: "ig_refresh_token", access_token: token.access_token });
    const r = await fetch(`${GRAPH}/refresh_access_token?${p}`);
    const d = await r.json();
    if (d.access_token) {
      const now = Date.now();
      const fresh = { access_token: d.access_token, expires_at: now + (d.expires_in || 5184000) * 1000, refreshed_at: now };
      await setSetting("instagram_token", fresh);
      return fresh;
    }
    console.error("Instagram token refresh failed:", d);
  }
  return token;
}

// ---------- sync ----------
function guessCategory(caption = "") {
  const t = caption.toLowerCase();
  if (/basket|корзин/.test(t)) return "Other";
  if (/box|коробк|бокс/.test(t)) return "Gift Boxes";
  if (/bouquet|букет/.test(t)) return "Bouquets";
  if (/rose|роз/.test(t)) return "Roses";
  if (/tulip|тюльпан/.test(t)) return "Tulips";
  return "Other";
}

function titleFrom(caption = "") {
  const line = caption.split("\n")[0].replace(/#\S+/g, "").trim();
  return line.length > 80 ? `${line.slice(0, 77)}…` : line;
}

async function igGet(path, token) {
  const r = await fetch(`${GRAPH}${path}${path.includes("?") ? "&" : "?"}access_token=${encodeURIComponent(token)}`);
  const d = await r.json();
  if (d.error) throw new Error(`Instagram API: ${d.error.message}`);
  return d;
}

export async function syncInstagram() {
  const { access_token } = await getFreshToken();
  const supabase = createServiceClient();
  const imported = new Set((await getSetting("instagram_imported")) || []);

  const feed = await igGet("/me/media?fields=id,caption,media_type,media_url,timestamp&limit=50", access_token);

  // Collect images (skip videos), expand carousels
  const images = [];
  for (const m of feed.data || []) {
    if (m.media_type === "IMAGE") {
      images.push({ id: m.id, url: m.media_url, caption: m.caption, ts: m.timestamp });
    } else if (m.media_type === "CAROUSEL_ALBUM") {
      const kids = await igGet(`/${m.id}/children?fields=id,media_type,media_url`, access_token);
      for (const k of kids.data || []) {
        if (k.media_type === "IMAGE") images.push({ id: `${m.id}:${k.id}`, url: k.media_url, caption: m.caption, ts: m.timestamp });
      }
    }
  }

  const fresh = images.filter((i) => !imported.has(i.id)).reverse().slice(0, MAX_NEW_PER_RUN);
  let added = 0;
  const errors = [];

  for (const img of fresh) {
    try {
      const res = await fetch(img.url);
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = await res.arrayBuffer();
      const fileName = `ig-${img.id.replace(/[^0-9A-Za-z_-]/g, "_")}.jpg`;

      const { error: upErr } = await supabase.storage
        .from("gallery")
        .upload(fileName, buf, { contentType: res.headers.get("content-type") || "image/jpeg", upsert: true });
      if (upErr) throw new Error(upErr.message);

      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);
      const { error: dbErr } = await supabase.from("gallery_photos").insert({
        url: publicUrl,
        category: guessCategory(img.caption),
        title: titleFrom(img.caption),
        file_name: fileName,
        created_at: img.ts,
      });
      if (dbErr) throw new Error(dbErr.message);

      imported.add(img.id);
      added++;
    } catch (e) {
      errors.push(`${img.id}: ${e.message}`);
    }
  }

  // Remember imported IDs so photos deleted in /admin are not re-imported
  await setSetting("instagram_imported", [...imported]);
  await setSetting("instagram_last_sync", { at: new Date().toISOString(), added, errors: errors.slice(0, 5) });

  return { added, remaining: Math.max(0, images.filter((i) => !imported.has(i.id)).length), errors };
}
