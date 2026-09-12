"use client";

import { formatPrice } from "@/lib/utils";
import type { Fulfillment } from "@/lib/order";

export interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition";

export function CheckoutDetailsForm({
  fulfillment,
  onFulfillmentChange,
  form,
  onFormChange,
  error,
  submitting,
  total,
  onSubmit,
}: {
  fulfillment: Fulfillment;
  onFulfillmentChange: (f: Fulfillment) => void;
  form: CustomerForm;
  onFormChange: (form: CustomerForm) => void;
  error: string | null;
  submitting: boolean;
  total: number;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const set = (patch: Partial<CustomerForm>) => onFormChange({ ...form, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h2 className="font-serif text-lg font-semibold mb-2">How would you like your order?</h2>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-muted">
          {(["delivery", "collection"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onFulfillmentChange(option)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                fulfillment === option
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold">Your details</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Full name</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Mario Rossi"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="07123 456789"
              autoComplete="tel"
              inputMode="tel"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="mario@example.com"
            autoComplete="email"
            inputMode="email"
            required
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            We&apos;ll send your order confirmation here.
          </p>
        </div>

        {fulfillment === "delivery" && (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Delivery address</label>
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => set({ address: e.target.value })}
              placeholder="12 High Street, Epsom, KT19 8AB"
              autoComplete="street-address"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Notes <span className="text-muted-foreground/70">(optional)</span>
          </label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={2}
            value={form.notes}
            onChange={(e) => set({ notes: e.target.value })}
            placeholder="Allergies, buzzer code, extra chilli…"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary text-primary-foreground font-semibold px-5 py-3 shadow-sm hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60"
      >
        {submitting ? "Preparing payment…" : `Continue to payment · ${formatPrice(total)}`}
      </button>
    </form>
  );
}
