import { processPaidSession } from "@/lib/orders";

export const dynamic = "force-dynamic";

// Called by the /success page after payment (backup to the Stripe webhook)
export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) return Response.json({ error: "No session" }, { status: 400 });
    return Response.json(await processPaidSession(sessionId));
  } catch (err) {
    console.error("Notify error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
