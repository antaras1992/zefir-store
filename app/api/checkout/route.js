import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { items, shipping } = await request.json();

    if (!items || items.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items = items.map((item) => {
      const details = [];
      if (item.size && item.size !== "Single" && item.size !== "Basket") details.push(item.size);
      if (item.flavor) details.push(item.flavor);
      const description = details.length > 0 ? details.join(" · ") : undefined;

      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: item.name,
            ...(description ? { description } : {}),
            ...(item.msg ? { metadata: { card_message: item.msg } } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      };
    });

    // Add shipping as a line item (if not free)
    if (shipping && shipping.price > 0) {
      line_items.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: `Shipping — ${shipping.name}`,
            ...(shipping.eta ? { description: shipping.eta } : {}),
          },
          unit_amount: Math.round(shipping.price * 100),
        },
        quantity: 1,
      });
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const sessionConfig = {
      mode: "payment",
      line_items,
      phone_number_collection: { enabled: true },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    };

    // Collect shipping address unless it's pickup
    if (!shipping || shipping.id !== "pickup") {
      sessionConfig.shipping_address_collection = { allowed_countries: ["CA"] };
    }

    // Store chosen shipping method in metadata
    if (shipping) {
      sessionConfig.metadata = {
        shipping_method: shipping.name,
        shipping_price: String(shipping.price),
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}