"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useCart, lineUnitPrice, type CartLine } from "./cart-context";
import { addDays, dayLabel, firstOrderDay, parseIso, useOrder } from "./order-context";
import { WhenPicker } from "./home/when-picker";
import { FIELD, LABEL } from "./form-styles";
import { formatPrice } from "@/lib/format";
import { cateringStatus } from "@/lib/catering";
import { CardForm, type CardFormHandle } from "./card-form";
import { AddressAutocomplete } from "./address-autocomplete";
import { WalletButtons } from "./wallet-buttons";
import {
  placeOrder,
  quoteDelivery,
  type CheckoutResult,
  type DeliveryQuoteResult,
} from "@/app/checkout/actions";

type Quote = Extract<DeliveryQuoteResult, { ok: true }>;
type Address = {
  line1: string;
  line2: string;
  locality: string;
  region: string;
  postalCode: string;
  coords?: { lat: number; lon: number };
};

const HIDDEN_VARIATIONS = ["Each", "Slice", "Regular"];

// Square's browser-side payment keys. Without them (local dev, the preview app) the payment
// step shows its layout as a non-working placeholder instead of an error.
const PAYMENTS_CONNECTED = !!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID && !!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

/** "7:30am" on an ISO day → an ISO timestamp for Square's pickup/delivery time. */
function slotToIso(date: string, slot: string): string | undefined {
  const m = slot.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
  if (!m) return undefined;
  const d = parseIso(date);
  d.setHours((Number(m[1]) % 12) + (m[3] === "pm" ? 12 : 0), Number(m[2]), 0, 0);
  return d.toISOString();
}

/**
 * Checkout (v4). Pickup/delivery and the day/time come from the choice the
 * customer already made on the menu (changeable here), then details, address
 * for delivery, and payment — with the order summary pinned alongside.
 */
export function Checkout({ currency }: { currency: string }) {
  const { lines, subtotalCents, clear, remove } = useCart();
  const order = useOrder();
  const cardRef = useRef<CardFormHandle>(null);

  const [whenOpen, setWhenOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addr, setAddr] = useState<Address>({ line1: "", line2: "", locality: "", region: "", postalCode: "" });
  const [note, setNote] = useState("");

  // A delivery quote only holds for the address and bag it was calculated for.
  const [quoted, setQuoted] = useState<{ key: string; quote: Quote } | null>(null);
  const [quoting, setQuoting] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);

  const isDelivery = order.mode === "delivery";
  const quoteKey = JSON.stringify([addr, lines.map((l) => [l.key, l.quantity])]);
  const quote = quoted?.key === quoteKey ? quoted.quote : null;

  // Manual edits invalidate coordinates captured from an autocomplete pick,
  // so the quote re-geocodes the edited address instead of using stale coords.
  const setAddrField = (field: keyof Omit<Address, "coords">, value: string) =>
    setAddr((prev) => ({ ...prev, [field]: value, coords: undefined }));

  const deliveryFeeCents = isDelivery && quote ? quote.feeCents : 0;
  // Catering volume discount — matches the server-authoritative tier applied at
  // order creation, so the total on screen equals the amount charged.
  const catering = cateringStatus(subtotalCents);
  const discountCents = catering.discountCents;
  const estimatedTotalCents = subtotalCents - discountCents + deliveryFeeCents;

  // Items sold out for the chosen day block payment until the order moves or they're removed.
  const blocked = order.isFirstDay ? lines.filter((l) => l.soldOutToday) : [];
  const nextDay = addDays(firstOrderDay(), 1);

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
          coords: addr.coords,
        },
        lines,
      );
      if (res.ok) setQuoted({ key: quoteKey, quote: res });
      else setError(res.error);
    } catch {
      setError("Couldn't calculate delivery. Please try again.");
    } finally {
      setQuoting(false);
    }
  }

  if (placed) return <Confirmation placed={placed} />;

  if (lines.length === 0) {
    return (
      <main className="flex flex-col items-center gap-6 bg-white px-6 py-28 text-center">
        <p className="euro-eyebrow text-euro-muted">Checkout</p>
        <h1 className="euro-heading text-[clamp(26px,2.8vw,38px)] text-euro-ink">Your bag is empty</h1>
        <Link href="/pre-order" className="btn-euro">
          Browse the menu
        </Link>
      </main>
    );
  }

  /** Snapshot what the customer ordered (the bag is cleared on success) for the confirmation. */
  function complete(result: Extract<CheckoutResult, { ok: true }>) {
    setPlaced({
      result,
      name: name.trim(),
      delivery: isDelivery,
      when: order.label.replace(/^(Pickup|Delivery) · /, ""),
      address: isDelivery ? [addr.line1, addr.locality].map((s) => s.trim()).filter(Boolean).join(", ") : "",
      items: lines.map((l) => ({ key: l.key, name: l.itemName, qty: l.quantity, cents: lineUnitPrice(l) * l.quantity })),
    });
    clear();
    window.scrollTo({ top: 0 });
  }

  /** Shared pre-payment checks. Returns an error message, or null if valid. */
  function validateForm(): string | null {
    if (blocked.length > 0) return "Some items have sold out for this day — move the order or remove them.";
    if (!order.date || !order.time) return "Please choose a day and time.";
    if (!name.trim() || !phone.trim()) return "Please enter your name and phone number.";
    if (PAYMENTS_CONNECTED && isDelivery && !quote) return "Please calculate your delivery fee before paying.";
    return null;
  }

  /** Place the order with a payment token (from the card field OR a wallet). */
  async function finalizeOrder(token: string) {
    setSubmitting(true);
    setError(null);
    try {
      const asap = order.time === "ASAP";
      const res = await placeOrder({
        sourceId: token,
        lines,
        fulfillmentType: isDelivery ? "DELIVERY" : "PICKUP",
        timing: asap ? "ASAP" : "SCHEDULED",
        scheduledAt: asap ? undefined : slotToIso(order.date, order.time),
        customer: { name: name.trim(), phone: phone.trim(), email: email.trim() || undefined },
        address: isDelivery
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
        complete(res);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    // Square not connected (local, preview): walk through to the thank-you page with a
    // clearly marked preview order. Nothing is sent to Square and nothing is charged.
    if (!PAYMENTS_CONNECTED) {
      complete({
        ok: true,
        orderId: String(1000 + Math.floor(Math.random() * 9000)),
        totalCents: estimatedTotalCents,
        deliveryFeeCents,
        discountCents,
        currency,
        status: "PREVIEW",
      });
      return;
    }

    setSubmitting(true);
    const token = await cardRef.current?.tokenize();
    if (!token) {
      setSubmitting(false);
      return;
    }
    await finalizeOrder(token);
  }

  return (
    <main className="bg-white px-6 pb-24 pt-10 md:px-12 md:pt-14">
      <div className="mx-auto max-w-[1180px]">
        <Link
          href="/pre-order"
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-euro-muted transition-colors hover:text-euro-ink"
        >
          ← Continue shopping
        </Link>
        <div className="mb-10 mt-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="euro-heading text-[clamp(28px,3vw,40px)] text-euro-ink">Checkout</h1>
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-euro-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Secure payment by Square
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <Summary
            lines={lines}
            currency={currency}
            subtotalCents={subtotalCents}
            discountCents={discountCents}
            discountPct={catering.currentPct}
            deliveryQuote={isDelivery ? quote : null}
            totalCents={estimatedTotalCents}
          />

          <form onSubmit={handleSubmit} className="flex flex-col lg:col-start-1 lg:row-start-1">
            {/* 1 — pickup/delivery + time, carried over from the menu */}
            <Step n={1} title={isDelivery ? "Delivery" : "Pickup"}>
              <div className="relative">
                <div className="flex items-center justify-between gap-4 border border-euro-line px-5 py-4">
                  <span className="flex flex-col gap-1">
                    <span className="text-[14px] text-euro-ink">{order.date ? order.label : "Choose a day and time"}</span>
                    <span className="text-[12.5px] text-euro-soft">
                      {isDelivery ? "Delivered to your door" : "974 High St, Armadale · Open 7 days, 7am – 3pm"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setWhenOpen((o) => !o)}
                    aria-expanded={whenOpen}
                    className="flex-none text-[11px] font-medium uppercase tracking-[0.18em] text-euro-ink underline underline-offset-[6px] hover:opacity-70"
                  >
                    Change
                  </button>
                </div>
                {whenOpen && (
                  <div className="mt-2 md:absolute md:right-0 md:top-full md:z-20">
                    <WhenPicker onDone={() => setWhenOpen(false)} />
                  </div>
                )}
              </div>
              {blocked.length > 0 && (
                <div role="alert" className="mt-4 flex flex-col gap-3 bg-euro-cream px-5 py-4">
                  <span className="euro-label text-xs text-euro-ink">Sold out for {dayLabel(order.date).toLowerCase()}</span>
                  <span className="text-[13.5px] leading-relaxed text-euro-text">
                    {blocked.map((l) => l.itemName).join(", ")} {blocked.length === 1 ? "has" : "have"} sold out for{" "}
                    {dayLabel(order.date).toLowerCase()}.
                  </span>
                  <span className="flex flex-wrap gap-x-6 gap-y-2">
                    <button
                      type="button"
                      onClick={() => order.setWhen(nextDay)}
                      className="text-[11px] font-medium uppercase tracking-[0.18em] text-euro-ink underline underline-offset-[6px]"
                    >
                      Order for {dayLabel(nextDay).toLowerCase()}
                    </button>
                    <button
                      type="button"
                      onClick={() => blocked.forEach((l) => remove(l.key))}
                      className="text-[11px] font-medium uppercase tracking-[0.18em] text-euro-muted underline underline-offset-[6px]"
                    >
                      Remove {blocked.length === 1 ? "it" : "them"}
                    </button>
                  </span>
                </div>
              )}
            </Step>

            {/* 2 — details */}
            <Step n={2} title="Your details">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="co-name" className={LABEL}>
                    Name
                  </label>
                  <input id="co-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className={FIELD} />
                </div>
                <div>
                  <label htmlFor="co-phone" className={LABEL}>
                    Phone
                  </label>
                  <input
                    id="co-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="co-email" className={LABEL}>
                    Email <span className="normal-case tracking-normal text-euro-muted">(optional)</span>
                  </label>
                  <input
                    id="co-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={FIELD}
                  />
                </div>
              </div>
            </Step>

            {/* 3 — delivery address (delivery only) */}
            {isDelivery && (
              <Step n={3} title="Delivery address">
                <div className="flex flex-col gap-4">
                  <AddressAutocomplete onSelect={(a) => setAddr((prev) => ({ ...prev, ...a }))} />
                  <input
                    value={addr.line1}
                    onChange={(e) => setAddrField("line1", e.target.value)}
                    placeholder="Street address"
                    autoComplete="address-line1"
                    className={FIELD}
                  />
                  <input
                    value={addr.line2}
                    onChange={(e) => setAddrField("line2", e.target.value)}
                    placeholder="Unit / apt (optional)"
                    autoComplete="address-line2"
                    className={FIELD}
                  />
                  <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3">
                    <input
                      value={addr.locality}
                      onChange={(e) => setAddrField("locality", e.target.value)}
                      placeholder="Suburb"
                      autoComplete="address-level2"
                      className={FIELD}
                    />
                    <input
                      value={addr.region}
                      onChange={(e) => setAddrField("region", e.target.value)}
                      placeholder="State"
                      autoComplete="address-level1"
                      className={FIELD}
                    />
                    <input
                      value={addr.postalCode}
                      onChange={(e) => setAddrField("postalCode", e.target.value)}
                      placeholder="Postcode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      className={FIELD}
                    />
                  </div>

                  {quote ? (
                    <div className="flex flex-col gap-1 bg-euro-tint px-5 py-4">
                      <span className="text-[14px] text-euro-ink">
                        {quote.waived ? (
                          "Free delivery — your order is over $150"
                        ) : (
                          <>
                            Delivery {formatPrice(quote.feeCents, currency)}{" "}
                            <span className="text-euro-soft">· {quote.distanceKm} km from the shop</span>
                          </>
                        )}
                      </span>
                      <span className="text-[12.5px] text-euro-soft">{quote.resolvedAddress}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={getQuote}
                      disabled={quoting}
                      className="btn-euro-outline w-full text-euro-ink hover:bg-euro-ink hover:text-white disabled:opacity-50"
                    >
                      {quoting ? "Checking distance…" : "Calculate delivery fee"}
                    </button>
                  )}
                </div>
              </Step>
            )}

            {/* Payment */}
            <Step n={isDelivery ? 4 : 3} title="Payment">
              <div className="flex flex-col gap-5">
                {PAYMENTS_CONNECTED ? (
                  <>
                    {/* Express checkout — Google Pay / Apple Pay (shown only where supported) */}
                    <WalletButtons
                      amountCents={estimatedTotalCents}
                      currency={currency}
                      validate={validateForm}
                      onToken={finalizeOrder}
                      onError={setError}
                    />
                    <div>
                      <span className={LABEL}>Card</span>
                      <div className="border border-euro-line bg-white px-2 pt-2">
                        <CardForm ref={cardRef} onError={setError} />
                      </div>
                      {process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT !== "production" && (
                        <p className="mt-2 text-[12px] text-euro-muted">
                          Test card: 4111 1111 1111 1111 · any future expiry · CVV 111 · postcode 12345
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <PaymentPreview />
                )}
                <div>
                  <label htmlFor="co-note" className={LABEL}>
                    Order note <span className="normal-case tracking-normal text-euro-muted">(optional)</span>
                  </label>
                  <input
                    id="co-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={isDelivery ? "e.g. leave at the door" : "e.g. birthday candle, please"}
                    className={FIELD}
                  />
                </div>
              </div>
            </Step>

            {error && (
              <p role="alert" className="mt-8 border-l-2 border-euro-ink bg-euro-cream px-5 py-3 text-[13.5px] text-euro-ink">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting || blocked.length > 0} className="btn-euro mt-8 h-[54px] w-full">
              {submitting ? "Placing order…" : `Place order · ${formatPrice(estimatedTotalCents, currency)}`}
            </button>
            <p className="mt-3 text-center text-[12px] text-euro-muted">
              Tax is calculated by Square at payment.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

/**
 * The payment step's layout — wallet buttons, divider and card fields — shown when
 * Square isn't connected, so the design can be reviewed. Nothing here takes payment.
 */
function PaymentPreview() {
  const box = "flex h-12 items-center whitespace-nowrap bg-white px-4 text-[14px] text-euro-muted/70";
  return (
    <div className="flex flex-col gap-4" aria-label="Payment (not connected)">
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" disabled className="flex h-12 items-center justify-center gap-1.5 bg-black text-[15px] font-medium text-white">
          <svg width="15" height="18" viewBox="0 0 17 20" fill="currentColor" aria-hidden="true">
            <path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9C3.6 4.8 2 5.8 1.1 7.4c-1.9 3.2-.5 8 1.3 10.6.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.9-1.1-3-4.3ZM11.5 3c.7-.9 1.2-2 1.1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3-1.5Z" />
          </svg>
          Pay
        </button>
        <button type="button" disabled className="flex h-12 items-center justify-center gap-1.5 border border-euro-line bg-white text-[15px] font-medium text-[#3c4043]">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7Z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.8 3.6-4.9 6.7-4.9Z" />
          </svg>
          Pay
        </button>
      </div>
      <div className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-euro-muted">
        <span className="h-px flex-1 bg-euro-line" />
        or pay with card
        <span className="h-px flex-1 bg-euro-line" />
      </div>
      <div>
        <span className={LABEL}>Card</span>
        <div className="grid grid-cols-[minmax(0,1fr)_96px_72px] divide-x divide-euro-line border border-euro-line">
          <span className={box}>Card number</span>
          <span className={box}>MM / YY</span>
          <span className={box}>CVV</span>
        </div>
      </div>
      <p className="text-[12px] text-euro-muted">Payments connect once Square is set up — nothing can be charged here.</p>
    </div>
  );
}

/** A numbered checkout section with a hairline above it. */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-euro-line py-8 first:border-t-0 first:pt-0">
      <h2 className="flex items-baseline gap-3">
        <span className="text-[11px] font-medium tracking-[0.2em] text-euro-muted">0{n}</span>
        <span className="euro-label text-euro-ink">{title}</span>
      </h2>
      {children}
    </section>
  );
}

/** Order summary: pinned beside the form on desktop; a fold-out at the top on phones. */
function Summary({
  lines,
  currency,
  subtotalCents,
  discountCents,
  discountPct,
  deliveryQuote,
  totalCents,
}: {
  lines: CartLine[];
  currency: string;
  subtotalCents: number;
  discountCents: number;
  discountPct: number;
  deliveryQuote: Quote | null;
  totalCents: number;
}) {
  const { setQty, remove } = useCart();
  const [open, setOpen] = useState(false);
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <aside className="bg-euro-tint lg:sticky lg:top-[136px] lg:col-start-2 lg:row-start-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left lg:pointer-events-none"
      >
        <span className="euro-label text-euro-ink">
          Order summary <span className="text-euro-muted">({count})</span>
        </span>
        <span className="flex items-center gap-3 text-[14px] tabular-nums text-euro-ink lg:hidden">
          {formatPrice(totalCents, currency)}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d={open ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
          </svg>
        </span>
      </button>

      <div className={`${open ? "block" : "hidden"} lg:block`}>
        <ul className="divide-y divide-euro-line border-t border-euro-line px-6">
          {lines.map((l) => {
            const subline = [l.variationName, ...l.modifiers.map((m) => m.name)]
              .filter((s) => s && !HIDDEN_VARIATIONS.includes(s))
              .join(" · ");
            return (
              <li key={l.key} className="flex gap-4 py-5">
                <div className="h-[72px] w-[58px] flex-none bg-euro-cream">
                  {l.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.imageUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[12.5px] font-medium uppercase leading-snug tracking-[0.1em] text-euro-ink">{l.itemName}</span>
                    <span className="whitespace-nowrap text-[13px] tabular-nums text-euro-ink">
                      {formatPrice(lineUnitPrice(l) * l.quantity, currency)}
                    </span>
                  </span>
                  {subline && <span className="truncate text-[12px] text-euro-soft">{subline}</span>}
                  <span className="mt-auto flex items-center justify-between pt-2">
                    <span className="flex items-center border border-euro-line bg-white">
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.quantity - 1)}
                        aria-label={`One fewer ${l.itemName}`}
                        className="h-8 w-8 text-euro-ink"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-[13px] tabular-nums text-euro-ink">{l.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQty(l.key, l.quantity + 1)}
                        aria-label={`One more ${l.itemName}`}
                        className="h-8 w-8 text-euro-ink"
                      >
                        +
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(l.key)}
                      className="text-[11px] uppercase tracking-[0.14em] text-euro-muted underline-offset-4 hover:text-euro-ink hover:underline"
                    >
                      Remove
                    </button>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <dl className="flex flex-col gap-2 border-t border-euro-line px-6 py-5 text-[13.5px]">
        <div className="flex justify-between text-euro-soft">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotalCents, currency)}</dd>
        </div>
        {discountCents > 0 && (
          <div className="flex justify-between text-euro-ink">
            <dt>Catering discount ({discountPct}% off)</dt>
            <dd className="tabular-nums">−{formatPrice(discountCents, currency)}</dd>
          </div>
        )}
        {deliveryQuote && (
          <div className="flex justify-between text-euro-soft">
            <dt>Delivery</dt>
            <dd className="tabular-nums">{deliveryQuote.feeCents === 0 ? "Free" : formatPrice(deliveryQuote.feeCents, currency)}</dd>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-euro-line pt-4 text-euro-ink">
          <dt className="euro-label">Total</dt>
          <dd className="text-[16px] tabular-nums">{formatPrice(totalCents, currency)}</dd>
        </div>
      </dl>
    </aside>
  );
}

type Placed = {
  result: Extract<CheckoutResult, { ok: true }>;
  name: string;
  delivery: boolean;
  when: string;
  address: string;
  items: { key: string; name: string; qty: number; cents: number }[];
};

/** Short, readable order reference: Square's ids are long, so show the tail. */
function orderRef(id: string) {
  return id.length > 8 ? id.slice(-6).toUpperCase() : id;
}

/**
 * After payment — the v3 "Merci" board: order reference, a three-step progress
 * line, pickup/delivery and the order side by side, then the way back; with a
 * full-height croissant photo alongside on desktop.
 */
function Confirmation({ placed }: { placed: Placed }) {
  const { result, name, delivery, when, address, items } = placed;
  const first = name.split(" ")[0];
  const steps = ["Received", "Preparing", delivery ? "On its way" : "Ready to collect"];
  // Entrance sequence (see .merci-* in globals.css): each piece starts a beat after the last.
  const at = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <main className="grid bg-[#F6F6F9] md:grid-cols-[minmax(0,620fr)_minmax(0,520fr)]">
      <div className="flex flex-col gap-7 px-6 py-14 md:max-w-[680px] md:px-14 md:py-20">
        <div className="flex flex-col gap-3.5">
          <p className="merci-rise text-[12px] uppercase tracking-[0.3em] text-euro-soft" style={at(150)}>
            Order #{orderRef(result.orderId)} confirmed</p>
          <h1 className="font-display text-[clamp(48px,6vw,76px)] font-medium leading-[0.98] text-euro-ink">
            <span className="merci-rise inline-block" style={at(300)}>
              Merci{first ? "," : ""}
            </span>
            {first && (
              <>
                {" "}
                <em className="merci-rise inline-block" style={at(600)}>
                  {first}
                </em>
              </>
            )}
          </h1>
          <p className="merci-rise text-[17px] leading-[1.7] text-euro-soft" style={at(800)}>
            We&apos;re preparing your order now.
            {delivery ? " We'll deliver it to your address." : " We'll have it ready to collect at 974 High St."}
          </p>
        </div>

        <ol className="grid grid-cols-3 gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-col gap-2.5">
              {/* Received fills once (done); Preparing keeps drawing (happening now). */}
              <span className="relative h-[2px] bg-euro-line">
                {i === 0 && <span className="merci-fill absolute inset-0 bg-euro-ink" style={at(1000)} />}
                {i === 1 && <span className="merci-active absolute inset-0 bg-euro-ink" style={at(1600)} />}
              </span>
              <span
                className={`merci-rise text-[11px] uppercase tracking-[0.18em] ${i < 2 ? "text-euro-ink" : "text-euro-soft"}`}
                style={at(1000 + i * 450)}
              >
                {s}
              </span>
            </li>
          ))}
        </ol>

        <div
          className="merci-rise grid gap-6 border-y border-euro-line py-6 text-[14px] leading-[1.7] text-euro-soft sm:grid-cols-2"
          style={at(1900)}
        >
          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-euro-ink">{delivery ? "Delivery" : "Pickup"}</p>
            {when}
            <br />
            {delivery ? (
              address || "To your address"
            ) : (
              <>
                974 High St, Armadale VIC 3143
                <br />
                <a
                  href="https://maps.google.com/?q=974+High+St+Armadale+VIC+3143"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] uppercase tracking-[0.12em] text-euro-ink underline underline-offset-4"
                >
                  Get directions
                </a>
              </>
            )}
          </div>
          <div>
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.2em] text-euro-ink">Your order</p>
            {items.map((it) => (
              <span key={it.key} className="block">
                {it.name}
                {it.qty > 1 ? ` × ${it.qty}` : ""} — {formatPrice(it.cents, result.currency)}
              </span>
            ))}
            {result.deliveryFeeCents > 0 && (
              <span className="block">Delivery — {formatPrice(result.deliveryFeeCents, result.currency)}</span>
            )}
            {result.discountCents > 0 && (
              <span className="block">Catering discount — −{formatPrice(result.discountCents, result.currency)}</span>
            )}
            <span className="text-euro-ink">Paid {formatPrice(result.totalCents, result.currency)}</span>
          </div>
        </div>

        <div className="merci-rise flex flex-wrap gap-3.5" style={at(2100)}>
          <Link
            href="/"
            className="flex h-[54px] items-center bg-euro-ink px-6 text-[11.5px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-euro-accent"
          >
            Back to Les Collections
          </Link>
          <Link
            href="/catering"
            className="flex h-[54px] items-center border border-euro-ink px-6 text-[11.5px] uppercase tracking-[0.14em] text-euro-ink transition-colors hover:bg-euro-ink hover:text-white"
          >
            Planning an event? Catering
          </Link>
        </div>
        <p className="merci-rise text-[13px] text-euro-soft" style={at(2250)}>
          Need to change something? Call{" "}
          <a href="tel:+61398221234" className="text-euro-ink underline-offset-4 hover:underline">
            (03) 9822 1234
          </a>
          .
        </p>
      </div>

      <div className="relative order-first min-h-[260px] overflow-hidden md:order-none md:min-h-[760px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/featured/croissant-hover.jpg"
          alt="A croissant cut open to show its honeycomb layers"
          className="merci-photo absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </main>
  );
}
