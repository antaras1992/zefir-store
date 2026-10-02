import { isAdmin } from "@/lib/instagram";

export const dynamic = "force-dynamic";

// POST { password } → { ok: true } if it matches GALLERY_ADMIN_PASSWORD
export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  if (!isAdmin(password)) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true });
}
