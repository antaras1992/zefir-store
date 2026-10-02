import { syncInstagram, isAdmin, getSetting } from "@/lib/instagram";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called daily by Vercel Cron (Authorization: Bearer CRON_SECRET) or manually from /admin
export async function GET(request) {
  const auth = request.headers.get("authorization");
  const password = new URL(request.url).searchParams.get("password");
  // Vercel Cron: verified by CRON_SECRET if set, otherwise by its user agent (sync is harmless: it only imports own photos)
  const ua = request.headers.get("user-agent") || "";
  const cronOk = process.env.CRON_SECRET ? auth === `Bearer ${process.env.CRON_SECRET}` : ua.startsWith("vercel-cron");
  if (!cronOk && !isAdmin(password)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Keep-alive: a daily DB query stops the free Supabase project from auto-pausing after 7 idle days
  try {
    await createServiceClient().from("gallery_photos").select("id").limit(1);
  } catch (e) {
    console.error("Supabase keep-alive failed:", e);
  }

  try {
    const result = await syncInstagram();
    return Response.json({ ok: true, ...result });
  } catch (e) {
    console.error("Instagram sync error:", e);
    return Response.json({ ok: false, error: e.message, last: await getSetting("instagram_last_sync").catch(() => null) }, { status: 500 });
  }
}
