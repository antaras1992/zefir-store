import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Escape text for Telegram HTML parse mode
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatAddress = (addr) =>
  addr
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
        .filter(Boolean)
        .join(", ")
    : null;

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return Response.json({ error: "No session" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      return Response.json({ ok: false, reason: "not paid" });
    }

    // Items
    const items = (session.line_items?.data || [])
      .map((li) => {
        const name = li.price?.product?.name || li.description || "Item";
        const desc = li.price?.product?.description;
        const qty = li.quantity || 1;
        const amount = ((li.amount_total || 0) / 100).toFixed(2);
        return `• ${esc(name)}${desc ? ` — ${esc(desc)}` : ""} ×${qty} — $${amount}`;
      })
      .join("\n");

    // Card message from product metadata
    let cardMessage = "";
    (session.line_items?.data || []).forEach((li) => {
      const meta = li.price?.product?.metadata;
      if (meta && meta.card_message) cardMessage = meta.card_message;
    });

    const shipMethod = session.metadata?.shipping_method || "—";
    const shipPrice = session.metadata?.shipping_price || "0";
    const deliveryDate = session.metadata?.delivery_date || "Not specified";

    // Buyer (payer)
    const cust = session.customer_details || {};
    const buyerName = cust.name || "—";
    const email = cust.email || "—";
    const phone = cust.phone || "—";

    // Shipping: new Stripe API keeps it in collected_information.shipping_details,
    // older API versions in session.shipping_details
    const shipping =
      session.collected_information?.shipping_details ||
      session.shipping_details ||
      null;

    const shippingAddress = formatAddress(shipping?.address);
    const recipientName = shipping?.name || buyerName;
    const billingAddress = formatAddress(cust.address);

    const total = ((session.amount_total || 0) / 100).toFixed(2);

    // Telegram message
    let msg = `🎉 <b>New Zefir Canada order!</b>\n\n`;
    msg += `📦 <b>Items:</b>\n${items}\n\n`;
    if (cardMessage) msg += `💌 <b>Card:</b> "${esc(cardMessage)}"\n\n`;
    msg += `📅 <b>Needed by:</b> ${esc(deliveryDate)}\n`;
    msg += `🚚 <b>Shipping:</b> ${esc(shipMethod)} — $${esc(shipPrice)}\n\n`;

    if (shippingAddress) {
      msg += `📍 <b>SHIP TO:</b> ${esc(recipientName)}\n${esc(shippingAddress)}\n\n`;
    } else {
      msg += `📍 <b>SHIP TO:</b> ⚠️ no shipping address (pickup?)\n\n`;
    }

    msg += `👤 <b>Buyer:</b> ${esc(buyerName)}\n`;
    msg += `📞 <b>Phone:</b> ${esc(phone)}\n`;
    msg += `📧 <b>Email:</b> ${esc(email)}\n`;
    if (billingAddress) msg += `💳 <b>Billing:</b> ${esc(billingAddress)}\n`;
    msg += `\n💰 <b>Total:</b> $${total} CAD`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: "HTML",
        }),
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Notify error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}