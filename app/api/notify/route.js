import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return Response.json({ error: "No session" }, { status: 400 });
    }

    // Fetch the full checkout session from Stripe (with line items + customer)
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product", "customer_details"],
    });

    // Only notify for actually paid orders
    if (session.payment_status !== "paid") {
      return Response.json({ ok: false, reason: "not paid" });
    }

    // Prevent duplicate notifications (if page reloaded) — best effort
    // (For a robust solution you'd store sent IDs; kept simple here.)

    // Build the items list
    const items = (session.line_items?.data || [])
      .map((li) => {
        const name = li.description || li.price?.product?.name || "Item";
        const qty = li.quantity || 1;
        const amount = ((li.amount_total || 0) / 100).toFixed(2);
        return `• ${name} ×${qty} — $${amount}`;
      })
      .join("\n");

    // Card message from product metadata (if any)
    let cardMessage = "";
    (session.line_items?.data || []).forEach((li) => {
      const meta = li.price?.product?.metadata;
      if (meta && meta.card_message) cardMessage = meta.card_message;
    });

    // Shipping method from session metadata
    const shipMethod = session.metadata?.shipping_method || "—";
    const shipPrice = session.metadata?.shipping_price || "0";

    // Customer + address
    const cust = session.customer_details || {};
    const name = cust.name || "—";
    const email = cust.email || "—";
    const phone = cust.phone || "—";
    const addr = session.shipping_details?.address || cust.address;
    let addressStr = "Pickup / no address";
    if (addr) {
      addressStr = [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code]
        .filter(Boolean)
        .join(", ");
    }

    const total = ((session.amount_total || 0) / 100).toFixed(2);

    // Compose Telegram message
    let msg = `🎉 <b>New Zefir Canada order!</b>\n\n`;
    msg += `📦 <b>Items:</b>\n${items}\n\n`;
    if (cardMessage) msg += `💌 <b>Card:</b> "${cardMessage}"\n\n`;
    msg += `🚚 <b>Shipping:</b> ${shipMethod} — $${shipPrice}\n`;
    msg += `📍 <b>Address:</b> ${addressStr}\n`;
    msg += `👤 <b>Name:</b> ${name}\n`;
    msg += `📞 <b>Phone:</b> ${phone}\n`;
    msg += `📧 <b>Email:</b> ${email}\n\n`;
    msg += `💰 <b>Total:</b> $${total} CAD`;

    // Send to Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: "HTML",
        }),
      });
      const tgText = await tgRes.text();
      console.log("TELEGRAM RESPONSE:", tgRes.status, tgText);
    } else {
      console.log("TELEGRAM MISSING CREDS:", { hasToken: !!token, hasChat: !!chatId });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Notify error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}