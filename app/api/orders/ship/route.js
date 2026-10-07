import { isAdmin, getSetting, setSetting } from "@/lib/instagram";
import { sendEmail, shippedEmail, CARRIERS } from "@/lib/email";

export const dynamic = "force-dynamic";

// POST { password, id, tracking, carrier } → mark order shipped + email the customer the tracking number
export async function POST(request) {
  const { password, id, tracking, carrier = "Canada Post" } = await request.json().catch(() => ({}));
  if (!isAdmin(password)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const num = String(tracking || "").trim().replace(/\s+/g, "");
  if (!id || !num) return Response.json({ error: "Enter a tracking number" }, { status: 400 });
  if (!CARRIERS[carrier]) return Response.json({ error: "Unknown carrier" }, { status: 400 });

  const key = `orders/${id}`;
  const order = await getSetting(key);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  if (!order.email || !order.email.includes("@")) return Response.json({ error: "This order has no customer email" }, { status: 400 });

  const mail = shippedEmail(order, carrier, num);
  try {
    await sendEmail({ to: order.email, subject: mail.subject, html: mail.html, text: mail.text });
  } catch (e) {
    // Save tracking anyway so it isn't lost
    await setSetting(key, { ...order, tracking: num, carrier, trackingUrl: mail.url, updated: new Date().toISOString() });
    return Response.json({ error: e.message }, { status: 502 });
  }

  const now = new Date().toISOString();
  await setSetting(key, { ...order, status: "shipped", tracking: num, carrier, trackingUrl: mail.url, shippedAt: now, emailedAt: now, updated: now });
  return Response.json({ ok: true, trackingUrl: mail.url });
}
