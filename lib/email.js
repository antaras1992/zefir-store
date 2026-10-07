// Transactional email via Resend (https://resend.com) — plain fetch, no SDK.
// Env: RESEND_API_KEY (required), EMAIL_FROM (optional, e.g. "Zefir Canada <orders@zefircanada.ca>")
import { EMAIL as SHOP_EMAIL, SITE_URL, INSTAGRAM_URL } from "@/lib/site";

export const CARRIERS = {
  "Canada Post": (n) => `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encodeURIComponent(n)}`,
  Purolator: (n) => `https://www.purolator.com/en/shipping/tracker?pin=${encodeURIComponent(n)}`,
  UPS: (n) => `https://www.ups.com/track?tracknum=${encodeURIComponent(n)}`,
  FedEx: (n) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(n)}`,
};

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendEmail({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Email is not set up yet (RESEND_API_KEY missing in Vercel)");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Zefir Canada <orders@zefircanada.ca>",
      to: [to],
      bcc: [SHOP_EMAIL],
      reply_to: SHOP_EMAIL,
      subject,
      html,
      text,
    }),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.message || `Email failed (${r.status})`);
  return d;
}

export function shippedEmail(order, carrier, tracking) {
  const url = (CARRIERS[carrier] || CARRIERS["Canada Post"])(tracking);
  const name = (order.buyer || "").split(" ")[0] || "there";
  const items = order.items || [];
  const subject = "Your Zefir Canada order is on its way 🌸";

  const text = [
    `Hi ${name},`,
    ``,
    `Great news — your order has been shipped!`,
    ``,
    `Carrier: ${carrier}`,
    `Tracking number: ${tracking}`,
    `Track your parcel: ${url}`,
    ``,
    `Order:`,
    ...items.map((it) => `• ${it.name}${it.details ? ` — ${it.details}` : ""} ×${it.qty}`),
    order.shipTo ? `\nShipping to: ${order.recipient || ""}, ${order.shipTo}` : "",
    ``,
    `Storage tip: keep the marshmallow flowers at room temperature, away from sun, heat and humidity — they stay fresh up to 3 weeks.`,
    ``,
    `Questions? Just reply to this email.`,
    `Thank you for choosing Zefir Canada!`,
    SITE_URL,
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;background:#FAF8F5;font-family:Arial,Helvetica,sans-serif;color:#1C1A18">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:24px 12px"><tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:12px;padding:28px">
    <tr><td style="font-family:Georgia,serif;font-size:22px;letter-spacing:2px">ZEFIR <span style="color:#D4537E">CANADA</span></td></tr>
    <tr><td style="padding-top:20px;font-size:16px">Hi ${esc(name)},</td></tr>
    <tr><td style="padding-top:10px;font-size:15px;line-height:1.6">Great news — your order has been shipped! 🌸</td></tr>
    <tr><td style="padding:18px 0">
      <table role="presentation" width="100%" style="background:#FBEAF0;border-radius:10px;padding:16px">
        <tr><td style="font-size:13px;color:#5F5E5A">Carrier</td></tr>
        <tr><td style="font-size:15px;padding-bottom:8px"><b>${esc(carrier)}</b></td></tr>
        <tr><td style="font-size:13px;color:#5F5E5A">Tracking number</td></tr>
        <tr><td style="font-size:17px;padding-bottom:14px"><b>${esc(tracking)}</b></td></tr>
        <tr><td><a href="${esc(url)}" style="display:inline-block;background:#D4537E;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px">Track your parcel</a></td></tr>
      </table>
    </td></tr>
    <tr><td style="font-size:14px;font-weight:bold;padding-bottom:6px">Your order</td></tr>
    ${items.map((it) => `<tr><td style="font-size:14px;line-height:1.6;color:#5F5E5A">• ${esc(it.name)}${it.details ? ` — ${esc(it.details)}` : ""} ×${esc(it.qty)}</td></tr>`).join("")}
    ${order.shipTo ? `<tr><td style="padding-top:12px;font-size:13px;color:#5F5E5A">Shipping to: ${esc(order.recipient || "")}, ${esc(order.shipTo)}</td></tr>` : ""}
    <tr><td style="padding-top:18px;font-size:13px;line-height:1.6;color:#5F5E5A">Storage tip: keep the marshmallow flowers at room temperature, away from sun, heat and humidity — they stay fresh up to 3 weeks.</td></tr>
    <tr><td style="padding-top:18px;font-size:14px;line-height:1.6">Questions? Just reply to this email.<br>Thank you for choosing Zefir Canada!</td></tr>
    <tr><td style="padding-top:20px;font-size:12px;color:#999"><a href="${SITE_URL}" style="color:#D4537E">zefircanada.ca</a> · <a href="${INSTAGRAM_URL}" style="color:#D4537E">Instagram</a></td></tr>
  </table></td></tr></table></body></html>`;

  return { subject, html, text, url };
}
