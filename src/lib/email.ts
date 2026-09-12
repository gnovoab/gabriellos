import { Resend } from "resend";
import {
  buildCustomerEmail,
  buildRestaurantEmail,
  type OrderEmailData,
} from "@/lib/email-templates";

const apiKey = process.env.RESEND_API_KEY;

/** Resend client. Null when no API key is configured. */
const resend = apiKey ? new Resend(apiKey) : null;

export function isEmailConfigured(): boolean {
  return Boolean(apiKey && process.env.ORDER_FROM_EMAIL);
}

/**
 * Sends the order confirmation to the customer and a notification to the
 * restaurant. Throws if sending fails so the webhook can let Stripe retry.
 */
export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const from = process.env.ORDER_FROM_EMAIL;
  const restaurantTo = process.env.ORDER_NOTIFY_EMAIL;

  if (!resend || !from) {
    console.warn("Email not configured (RESEND_API_KEY / ORDER_FROM_EMAIL missing); skipping.");
    return;
  }

  const customer = buildCustomerEmail(data);
  const restaurant = buildRestaurantEmail(data);

  const sends: Promise<unknown>[] = [];

  if (data.email) {
    sends.push(
      resend.emails.send({
        from,
        to: data.email,
        subject: customer.subject,
        html: customer.html,
      })
    );
  }

  if (restaurantTo) {
    sends.push(
      resend.emails.send({
        from,
        to: restaurantTo,
        replyTo: data.email || undefined,
        subject: restaurant.subject,
        html: restaurant.html,
      })
    );
  }

  const results = await Promise.allSettled(sends);
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    throw new Error(`Failed to send ${failed.length} order email(s).`);
  }
}

export type { OrderEmailData };
