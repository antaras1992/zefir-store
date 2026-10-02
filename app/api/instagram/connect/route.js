import { authorizeUrl, isAdmin } from "@/lib/instagram";

export const dynamic = "force-dynamic";

// Open /api/instagram/connect?password=ADMIN_PASSWORD (button in /admin)
export async function GET(request) {
  const password = new URL(request.url).searchParams.get("password");
  if (!isAdmin(password)) return new Response("Unauthorized", { status: 401 });
  if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
    return new Response("INSTAGRAM_APP_ID / INSTAGRAM_APP_SECRET are not set in Vercel", { status: 500 });
  }
  return Response.redirect(authorizeUrl(), 302);
}
