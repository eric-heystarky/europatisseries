"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart, lineUnitPrice } from "./cart-context";
import { formatPrice } from "@/lib/format";
import { CardForm, type CardFormHandle } from "./card-form";
import {
  placeOrder,
  quoteDelivery,
  type FulfillmentType,
  type Timing,
  type CheckoutResult,
  type DeliveryQuoteResult,
} from "@/app/checkout/actions";

type Quote = Extract<DeliveryQuoteResult, { ok: true }>;

export function Checkout({ currency }: { currency: string }) {
  const { lines, subtotalCents, clear } = useCart();
  const cardRef = useRef<CardFormHandle>(null);

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("PICKUP");
  const [timing, setTiming] = useState<Timing>("ASAP");
  const [scheduledAt, setScheduledAt] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState({ line1: "", line2: "", locality: "", region: "", postalCode: "" });
  const [note, setNote] = useState("");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<CheckoutResult, { ok: true }> | null>(null);

  useEffect(() => {
    setQuote(null);
  }, [addr, lines, fulfillmentType]);

  const setAddrField = (field: keyof typeof addr, value: string) =>
    setAddr((prev) => ({ ...prev, [field]: value }));

  const deliveryFeeCents = fulfillmentType === "DELIVERY" && quote ? quote.feeCents : 0;
  const estimatedTotalCents = subtotalCents + deliveryFeeCents;

  async function getQuote() {
    setError(null);
    if (!addr.line1.trim() || !addr.locality.trim()) {
      setError("Enter your street address and suburb to calculate delivery.");
      return;
    }
    setQuoting(true);
    try {
      const res = await quoteDelivery(
        {
          line1: addr.line1.trim(),
          line2: addr.line2.trim() || undefined,
          locality: addr.locality.trim(),
          region: addr.region.trim(),
          postalCode: addr.postalCode.trim(),
        },
        lines,
      );
      if (res.ok) setQuote(res);
      else setError(res.error);
    } catch {
      setError("Couldn't calculate delivery. Please try again.");
    } finally {
      setQuoting(false);
    }
  }

  // Confirmation screen.
  if (result) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border-2 border-border bg-primary text-2xl text-primary-foreground">
          ✓
        </div>
        <h1 className="font-serif text-3xl font-semibold uppercase tracking-wide">Order Confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks {name.split(" ")[0] || "—"}! We&apos;ve received your{" "}
          {fulfillmentType === "PICKUP" ? "pickup" : "delivery"} order.
        </p>
        <dl className="mx-auto mt-8 max-w-xs space-y-2 border-2 border-border p-4 text-sm">
          <div className="flex justify-between">
            <dt className="uppercase tracking-[0.12em] text-muted-foreground">Order</dt>
            <dd className="font-mono text-xs">{result.orderId.slice(0, 12)}…</dd>
          </div>
          {result.deliveryFeeCents > 0 && (
            <div className="flex justify-between">
              <dt className="uppercase tracking-[0.12em] text-muted-foreground">Delivery</dt>
              <dd className="tabular-nums">{formatPrice(result.deliveryFeeCents, result.currency)}</dd>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <dt className="uppercase tracking-[0.12em]">Total Paid</dt>
            <dd className="tabular-nums">{formatPrice(result.totalCents, result.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="uppercase tracking-[0.12em] text-muted-foreground">Payment</dt>
            <dd>{result.status}</dd>
          </div>
        </dl>
        <Link href="/" className="btn-brutal mt-8 px-6 py-3 text-sm">
          Back to Menu
        </Link>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold uppercase tracking-wide">Your Cart Is Empty</h1>
        <Link href="/" className="btn-brutal mt-6 px-6 py-3 text-sm">
          Browse the Menu
        </Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (fulfillmentType === "DELIVERY" && !quote) {
      setError("Please calculate your delivery fee before paying.");
      return;
    }
    if (timing === "SCHEDULED" && !scheduledAt) {
      setError("Please choose a time.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await cardRef.current?.tokenize();
      if (!token) {
        setSubmitting(false);
        return;
      }

      const res = await placeOrder({
        sourceId: token,
        lines,
        fulfillmentType,
        timing,
        scheduledAt: timing === "SCHEDULED" ? new Date(scheduledAt).toISOString() : undefined,
        customer: { name: name.trim(), phone: phone.trim(), email: email.trim() || undefined },
        address:
          fulfillmentType === "DELIVERY"
            ? {
                line1: addr.line1.trim(),
                line2: addr.line2.trim() || undefined,
                locality: addr.locality.trim(),
                region: addr.region.trim(),
                postalCode: addr.postalCode.trim(),
              }
            : undefined,
        note: note.trim() || undefined,
      });

      if (res.ok) {
        clear();
        setResult(res);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const Toggle = ({
    value,
    current,
    onClick,
    children,
  }: {
    value: string;
    current: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
        current === value ? "bg-primary text-primary-foreground" : "bg-card"
      }`}
    >
      {children}
    </button>
  );

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <Link href="/" className="text-xs font-bold uppercase tracking-[0.15em] hover:underline">
        ← Back to menu
      </Link>
      <h1 className="mb-7 mt-4 font-serif text-4xl font-semibold uppercase tracking-wide">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em]">How would you like your order?</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Toggle value="PICKUP" current={fulfillmentType} onClick={() => setFulfillmentType("PICKUP")}>
              Pickup
            </Toggle>
            <Toggle value="DELIVERY" current={fulfillmentType} onClick={() => setFulfillmentType("DELIVERY")}>
              Delivery
            </Toggle>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em]">When?</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Toggle value="ASAP" current={timing} onClick={() => setTiming("ASAP")}>
              ASAP
            </Toggle>
            <Toggle value="SCHEDULED" current={timing} onClick={() => setTiming("SCHEDULED")}>
              Schedule
            </Toggle>
          </div>
          {timing === "SCHEDULED" && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="field-brutal mt-2"
            />
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em]">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="field-brutal mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em]">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="field-brutal mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em]">Email (optional)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" className="field-brutal mt-1" />
          </div>
        </div>

        {fulfillmentType === "DELIVERY" && (
          <div className="space-y-3 border-2 border-border p-4">
            <label className="text-xs font-bold uppercase tracking-[0.18em]">Delivery address</label>
            <input value={addr.line1} onChange={(e) => setAddrField("line1", e.target.value)} placeholder="Street address" className="field-brutal" />
            <input value={addr.line2} onChange={(e) => setAddrField("line2", e.target.value)} placeholder="Unit / apt (optional)" className="field-brutal" />
            <div className="grid grid-cols-3 gap-2">
              <input value={addr.locality} onChange={(e) => setAddrField("locality", e.target.value)} placeholder="Suburb" className="field-brutal" />
              <input value={addr.region} onChange={(e) => setAddrField("region", e.target.value)} placeholder="State" className="field-brutal" />
              <input value={addr.postalCode} onChange={(e) => setAddrField("postalCode", e.target.value)} placeholder="Postcode" inputMode="numeric" className="field-brutal" />
            </div>

            {quote ? (
              <div className="border-2 border-border bg-card px-3 py-2 text-sm">
                {quote.waived ? (
                  <p className="font-bold uppercase tracking-[0.1em]">Free delivery — order over $300 🎉</p>
                ) : (
                  <p>
                    Delivery: <span className="font-bold">{quote.billedKm} km</span> ·{" "}
                    <span className="font-bold tabular-nums">{formatPrice(quote.feeCents, currency)}</span>{" "}
                    <span className="text-muted-foreground">({quote.distanceKm} km from the shop)</span>
                  </p>
                )}
                <p className="mt-0.5 text-xs text-muted-foreground">{quote.resolvedAddress}</p>
              </div>
            ) : (
              <button type="button" onClick={getQuote} disabled={quoting} className="btn-brutal-outline w-full py-2.5 text-xs">
                {quoting ? "Checking distance…" : "Calculate delivery fee"}
              </button>
            )}
          </div>
        )}

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em]">Order note (optional)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. leave at door" className="field-brutal mt-1" />
        </div>

        {/* Summary */}
        <div className="border-2 border-border bg-card p-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em]">Your order</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {l.quantity}× {l.itemName}
                  {l.modifiers.length > 0 && (
                    <span className="text-muted-foreground/70"> ({l.modifiers.map((m) => m.name).join(", ")})</span>
                  )}
                </span>
                <span className="tabular-nums">{formatPrice(lineUnitPrice(l) * l.quantity, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t-2 border-border pt-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotalCents, currency)}</span>
            </div>
            {fulfillmentType === "DELIVERY" && quote && (
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery{quote.waived ? " (free over $300)" : ` (${quote.billedKm} km)`}</span>
                <span className="tabular-nums">{quote.feeCents === 0 ? "Free" : formatPrice(quote.feeCents, currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold uppercase tracking-[0.1em]">
              <span>Estimated total</span>
              <span className="tabular-nums">{formatPrice(estimatedTotalCents, currency)}</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tax is calculated by Square at payment.</p>
        </div>

        {/* Card */}
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em]">Card details</label>
          <div className="mt-2 border-2 border-border p-1">
            <CardForm ref={cardRef} onError={setError} />
          </div>
          {process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT !== "production" && (
            <p className="mt-1 text-xs text-muted-foreground">
              Sandbox test card: 4111 1111 1111 1111 · any future expiry · CVV 111 · postcode 12345
            </p>
          )}
        </div>

        {error && <p className="border-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-brutal w-full py-3.5 text-sm">
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>
    </main>
  );
}
