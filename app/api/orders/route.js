import { isAdmin, listSettings, getSetting, setSetting } from "@/lib/instagram";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "in progress", "ready", "shipped", "delivered", "cancelled"];

// GET /api/orders?password=... → list of saved orders (newest first)
export async function GET(request) {
  const password = new URL(request.url).searchParams.get("password");
  if (!isAdmin(password)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const orders = await listSettings("orders");
    orders.sort((a, b) => new Date(b.created) - new Date(a.created));
    return Response.json({ orders, statuses: STATUSES });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// POST { password, id, status } → update order status
export async function POST(request) {
  const { password, id, status } = await request.json().catch(() => ({}));
  if (!isAdmin(password)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!id || !STATUSES.includes(status)) return Response.json({ error: "Bad request" }, { status: 400 });
  const key = `orders/${id}`;
  const order = await getSetting(key);
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  await setSetting(key, { ...order, status, updated: new Date().toISOString() });
  return Response.json({ ok: true });
}
