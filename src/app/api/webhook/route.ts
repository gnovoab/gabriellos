import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendOrderEmails } from "@/lib/email";
import type { OrderEmailData } from "@/lib/email-templates";
import { orderReference } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function metadataToOrder(pi: Stripe.PaymentIntent): OrderEmailData {
  const m = pi.metadata ?? {};
  return {
    name: m.customer_name ?? "",
    email: m.customer_email ?? pi.receipt_email ?? "",
    phone: m.customer_phone ?? "",
    fulfillment: m.fulfillment ?? "delivery",
    address: m.delivery_address ?? "",
    notes: m.notes ?? "",
    items: m.items ?? "",
    subtotal: m.subtotal ?? "",
    deliveryFee: m.delivery_fee ?? "0",
    total: m.total ?? "",
    orderRef: orderReference(pi.id),
  };
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured (STRIPE_WEBHOOK_SECRET missing)." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    try {
      await sendOrderEmails(metadataToOrder(paymentIntent));
    } catch (err) {
      // Return 500 so Stripe retries delivery of this event.
      const message = err instanceof Error ? err.message : "Failed to send order emails.";
      console.error("Order email error:", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
