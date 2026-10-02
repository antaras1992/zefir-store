import Stripe from "stripe";
import { isAdmin, getSetting, setSetting } from "@/lib/instagram";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_URL = "https://www.zefircanada.ca/api/stripe-webhook";

// One-time setup from /admin: creates the Stripe webhook and stores its signing secret
export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  if (!isAdmin(password)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const saved = await getSetting("stripe_webhook").catch(() => null);
    const list = await stripe.webhookEndpoints.list({ limit: 100 });
    const ours = list.data.filter((w) => w.url === WEBHOOK_URL);

    if (saved?.id && ours.some((w) => w.id === saved.id && w.status === "enabled")) {
      return Response.json({ ok: true, already: true });
    }

    // Secret of an existing endpoint can't be read again — replace it with a fresh one
    for (const w of ours) await stripe.webhookEndpoints.del(w.id);

    const created = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: ["checkout.session.completed", "checkout.session.async_payment_succeeded"],
      description: "Zefir Canada — orders to Telegram & admin",
    });
    await setSetting("stripe_webhook", { id: created.id, secret: created.secret, created: new Date().toISOString() });
    return Response.json({ ok: true, created: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
