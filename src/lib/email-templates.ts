import { estimatedTime } from "@/lib/order";

export interface OrderEmailData {
  name: string;
  email: string;
  phone: string;
  fulfillment: string;
  address: string;
  notes: string;
  items: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  orderRef: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const BRAND = "#C2410C";

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:4px 12px 4px 0;color:#6B5440;font-size:13px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:4px 0;color:#3A2A1E;font-size:13px;font-weight:600;">${escapeHtml(value)}</td>
  </tr>`;
}

function itemsList(items: string): string {
  const parts = items
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  return `<ul style="margin:8px 0 0;padding-left:18px;color:#3A2A1E;font-size:14px;">
    ${parts.map((p) => `<li style="margin:2px 0;">${escapeHtml(p)}</li>`).join("")}
  </ul>`;
}

function totals(d: OrderEmailData): string {
  const feeLabel = d.fulfillment === "delivery" ? "Delivery" : "Collection";
  const fee = Number(d.deliveryFee) > 0 ? `£${d.deliveryFee}` : "Free";
  return `<table style="width:100%;max-width:320px;margin-top:8px;border-collapse:collapse;">
    ${row("Subtotal", `£${d.subtotal}`)}
    ${row(feeLabel, fee)}
    <tr><td colspan="2" style="border-top:1px solid #E4D6BB;padding-top:6px;"></td></tr>
    <tr>
      <td style="padding:2px 12px 2px 0;font-size:15px;font-weight:700;color:#3A2A1E;">Total</td>
      <td style="padding:2px 0;font-size:15px;font-weight:700;color:${BRAND};">£${escapeHtml(d.total)}</td>
    </tr>
  </table>`;
}

function shell(title: string, body: string): string {
  return `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;background:#FBF5E9;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#FFFBF1;border:1px solid #E4D6BB;border-radius:16px;overflow:hidden;">
      <div style="padding:20px 24px;border-bottom:1px solid #E4D6BB;">
        <div style="font-size:22px;font-weight:700;color:${BRAND};font-family:Georgia,serif;">Gabriello&#39;s</div>
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7C5E3B;">Handmade · Napoletana</div>
      </div>
      <div style="padding:24px;">
        <h1 style="margin:0 0 12px;font-size:18px;color:#3A2A1E;">${escapeHtml(title)}</h1>
        ${body}
      </div>
    </div>
  </div>`;
}

export function buildCustomerEmail(d: OrderEmailData): { subject: string; html: string } {
  const fulfilment =
    d.fulfillment === "delivery"
      ? row("Delivering to", d.address)
      : row("Collection", "Pick up in-store");
  const etaLabel = d.fulfillment === "delivery" ? "Estimated delivery" : "Ready in";
  const body = `
    <p style="color:#3A2A1E;font-size:14px;margin:0 0 16px;">Thanks ${escapeHtml(
      d.name
    )} — we&#39;ve received your order and payment. Here are the details:</p>
    <div style="font-weight:600;color:#3A2A1E;font-size:14px;">Your order</div>
    ${itemsList(d.items)}
    ${totals(d)}
    <table style="width:100%;margin-top:16px;border-collapse:collapse;">${fulfilment}${row(
    etaLabel,
    estimatedTime(d.fulfillment)
  )}${row("Notes", d.notes)}${row("Order ref", d.orderRef)}</table>
    <p style="color:#6B5440;font-size:13px;margin-top:20px;">We&#39;ll be in touch if we need anything. Grazie! 🍕</p>`;
  return { subject: `Your Gabriello's order is confirmed`, html: shell("Order confirmed", body) };
}

export function buildRestaurantEmail(d: OrderEmailData): { subject: string; html: string } {
  const body = `
    <p style="color:#3A2A1E;font-size:14px;margin:0 0 16px;">A new ${escapeHtml(
      d.fulfillment
    )} order has been paid for.</p>
    <div style="font-weight:600;color:#3A2A1E;font-size:14px;">Items</div>
    ${itemsList(d.items)}
    ${totals(d)}
    <table style="width:100%;margin-top:16px;border-collapse:collapse;">
      ${row("Customer", d.name)}
      ${row("Phone", d.phone)}
      ${row("Email", d.email)}
      ${row("Fulfilment", d.fulfillment)}
      ${row("Estimated", estimatedTime(d.fulfillment))}
      ${row("Address", d.address)}
      ${row("Notes", d.notes)}
      ${row("Order ref", d.orderRef)}
    </table>`;
  return {
    subject: `New order — ${d.name} (£${d.total})`,
    html: shell("New order received", body),
  };
}
