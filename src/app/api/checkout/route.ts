import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { computeOrder, toPence, type Fulfillment, type OrderLineInput } from "@/lib/order";

interface CheckoutBody {
  items?: OrderLineInput[];
  fulfillment?: Fulfillment;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments are not configured. Add STRIPE_SECRET_KEY to .env.local." },
      { status: 500 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const fulfillment: Fulfillment = body.fulfillment === "collection" ? "collection" : "delivery";
  const customer = body.customer ?? {};

  if (items.length === 0) {
    return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
  }

  if (!customer.name || !customer.phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (fulfillment === "delivery" && !customer.address) {
    return NextResponse.json({ error: "A delivery address is required." }, { status: 400 });
  }

  const order = computeOrder(items, fulfillment);
  if (order.lines.length === 0 || order.total <= 0) {
    return NextResponse.json({ error: "No valid items in your basket." }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toPence(order.total),
      currency: "gbp",
      // Card only (plus Apple/Google Pay wallets). Excludes Link so Stripe
      // doesn't ask for the email again — we already collect it in our form.
      payment_method_types: ["card"],
      description: `Gabriello's order — ${fulfillment}`,
      receipt_email: customer.email,
      metadata: {
        fulfillment,
        customer_name: customer.name.slice(0, 200),
        customer_email: customer.email.slice(0, 200),
        customer_phone: customer.phone.slice(0, 60),
        delivery_address: (customer.address ?? "").slice(0, 400),
        notes: (customer.notes ?? "").slice(0, 400),
        items: order.lines
          .map((l) => `${l.quantity}x ${l.name}`)
          .join(", ")
          .slice(0, 480),
        subtotal: order.subtotal.toFixed(2),
        delivery_fee: order.deliveryFee.toFixed(2),
        total: order.total.toFixed(2),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: order.total,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
