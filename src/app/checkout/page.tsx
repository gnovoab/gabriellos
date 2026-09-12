"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBasketStore, selectTotalItems } from "@/store/useBasketStore";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { CheckoutDetailsForm, type CustomerForm } from "@/components/CheckoutDetailsForm";
import { PaymentSection } from "@/components/PaymentSection";
import { DELIVERY_FEE, type Fulfillment } from "@/lib/order";

export default function CheckoutPage() {
  const items = useBasketStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [form, setForm] = useState<CustomerForm>({ name: "", email: "", phone: "", address: "", notes: "" });
  const [step, setStep] = useState<"details" | "payment">("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payTotal, setPayTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = mounted ? items : [];
  const count = selectTotalItems(list);
  const subtotal = list.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = fulfillment === "delivery" && count > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address for your confirmation.");
      return;
    }
    if (fulfillment === "delivery" && !form.address.trim()) {
      setError("Please enter a delivery address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: list.map((i) => ({ id: i.id, quantity: i.quantity })),
          fulfillment,
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setClientSecret(data.clientSecret);
      setPayTotal(typeof data.amount === "number" ? data.amount : total);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-secondary/10">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold text-primary">
            Gabriello&apos;s
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition">
            ← Back to menu
          </Link>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-serif text-3xl font-semibold mb-6">Checkout</h1>

        {mounted && count === 0 && step === "details" ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="text-4xl mb-3 opacity-40">🛒</div>
            <p className="text-sm text-muted-foreground">Your basket is empty.</p>
            <Link
              href="/"
              className="inline-block mt-4 rounded-full bg-primary text-primary-foreground font-semibold px-5 py-2.5 text-sm hover:brightness-110 transition"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
              {step === "details" ? (
                <CheckoutDetailsForm
                  fulfillment={fulfillment}
                  onFulfillmentChange={setFulfillment}
                  form={form}
                  onFormChange={setForm}
                  error={error}
                  submitting={submitting}
                  total={total}
                  onSubmit={handleContinue}
                />
              ) : (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-serif text-lg font-semibold">Payment</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {fulfillment === "delivery" ? "Delivery" : "Collection"} · {form.name}
                    </p>
                  </div>
                  {clientSecret && (
                    <PaymentSection
                      clientSecret={clientSecret}
                      total={payTotal}
                      fulfillment={fulfillment}
                      onBack={() => setStep("details")}
                    />
                  )}
                </div>
              )}
            </div>

            <CheckoutSummary items={list} fulfillment={fulfillment} />
          </div>
        )}
      </main>
    </div>
  );
}
