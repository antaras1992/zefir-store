import { stripe } from "@/lib/stripe";
import { processPaidSession } from "@/lib/orders";
import { getSetting } from "@/lib/instagram";

export const dynamic = "force-dynamic";
export const maxDuration = 30;



// Stripe calls this after every completed checkout — so no order is missed
// even if the customer closes the tab before the /success page loads.
export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET || (await getSetting("stripe_webhook").catch(() => null))?.secret;
  if (!secret) return new Response("Webhook secret not configured", { status: 500 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    return new Response(`Bad signature: ${e.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    try {
      await processPaidSession(event.data.object.id);
    } catch (e) {
      console.error("Webhook order error:", e);
      return new Response("Error", { status: 500 }); // Stripe will retry
    }
  }
  return Response.json({ received: true });
}
