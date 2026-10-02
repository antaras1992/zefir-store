import { syncInstagram, isAdmin, getSetting } from "@/lib/instagram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called daily by Vercel Cron (Authorization: Bearer CRON_SECRET) or manually from /admin
export async function GET(request) {
  const auth = request.headers.get("authorization");
  const password = new URL(request.url).searchParams.get("password");
  const cronOk = process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;
  if (!cronOk && !isAdmin(password)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await syncInstagram();
    return Response.json({ ok: true, ...result });
  } catch (e) {
    console.error("Instagram sync error:", e);
    return Response.json({ ok: false, error: e.message, last: await getSetting("instagram_last_sync").catch(() => null) }, { status: 500 });
  }
}
