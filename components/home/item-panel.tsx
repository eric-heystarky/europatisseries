"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ShopItem } from "@/lib/shop";
import { formatPrice } from "@/lib/format";
import { useCart } from "../cart-context";
import { addDays, dayLabel, firstOrderDay, useOrder } from "../order-context";
import { ModeToggle } from "./when-picker";

type Props = {
  item: ShopItem;
  currency: string;
  position: string;
  onClose: () => void;
  onChangeTime: () => void;
};

/**
 * The item's "Add to bag" panel: required choices, add-ons (always visible),
 * pickup/delivery for the whole order, quantity, then allergens on demand.
 * Pressing Add with a choice missing shakes the button and flags the group.
 */
export function ItemPanel({ item, currency, position, onClose, onChangeTime }: Props) {
  const { addLine, openDrawer } = useCart();
  const order = useOrder();
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [addOns, setAddOns] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [tried, setTried] = useState(false);
  const [shake, setShake] = useState(0);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const soldOut = !!item.soldOutToday && order.isFirstDay;
  const nextDay = addDays(firstOrderDay(), 1);
  const missing = item.groups.filter((g) => !picks[g.id]);

  const extraCents =
    item.groups.reduce((sum, g) => sum + (g.choices.find((c) => c.id === picks[g.id])?.priceCents ?? 0), 0) +
    item.addOns.filter((a) => addOns.includes(a.id)).reduce((sum, a) => sum + a.priceCents, 0);
  const unitCents = item.fromCents + extraCents;

  function add() {
    if (soldOut || missing.length > 0) {
      setTried(true);
      setShake((n) => n + 1);
      return;
    }
    const variationGroup = item.groups.find((g) => g.kind === "variation");
    const variationChoice = variationGroup?.choices.find((c) => c.id === picks[variationGroup.id]);
    const modifiers = [
      ...item.groups
        .filter((g) => g.kind === "modifier")
        .map((g) => g.choices.find((c) => c.id === picks[g.id])!)
        .map((c) => ({ id: c.id, name: c.name, priceCents: c.priceCents })),
      ...item.addOns.filter((a) => addOns.includes(a.id)),
    ];
    addLine(
      {
        itemId: item.id,
        itemName: item.name,
        variationId: variationChoice?.id ?? item.variationId,
        variationName: variationChoice?.name ?? item.variationName,
        basePriceCents: item.fromCents + (variationChoice?.priceCents ?? 0),
        modifiers,
        imageUrl: item.imageUrl ?? undefined,
        soldOutToday: item.soldOutToday,
      },
      qty,
    );
    toast.custom(
      (id) => (
        <div className="flex w-full items-center gap-3 border border-euro-line bg-white p-3 font-jost shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          {item.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt="" className="h-12 w-10 flex-none object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] uppercase tracking-[0.16em] text-euro-muted">Added to your bag</p>
            <p className="truncate text-[13px] text-euro-ink">
              {qty} × {item.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(id);
              openDrawer();
            }}
            className="euro-label flex-none text-[11px] text-euro-ink underline underline-offset-4"
          >
            View bag
          </button>
        </div>
      ),
      { duration: 3500 },
    );
    onClose();
  }

  return (
    <aside
      role="region"
      aria-label={`${item.name} details`}
      className="flex flex-col bg-white md:border md:border-euro-line md:shadow-[0_24px_50px_rgba(0,0,0,0.06)] md:animate-in md:fade-in md:slide-in-from-right-10 md:duration-300"
    >
      <div className="relative">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} className="block h-[240px] w-full bg-euro-cream object-cover md:h-[320px]" />
        ) : (
          <div className="h-[140px] bg-euro-cream" />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3.5 top-3.5 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-euro-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div className="flex flex-col gap-5 px-6 pb-8 pt-6 md:px-8 md:pt-7">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-euro-muted">{position}</span>
          <h3 className="euro-heading text-[22px] text-euro-ink md:text-[26px]">{item.name}</h3>
          <span className="text-sm text-euro-soft">
            {item.groups.some((g) => g.kind === "variation") ? "From " : ""}
            {formatPrice(item.fromCents, currency)}
          </span>
        </div>

        {item.description && <p className="text-sm leading-[1.75] text-euro-text">{item.description}</p>}

        {soldOut && (
          <div
            key={`oos-${shake}`}
            role="alert"
            className={`flex flex-col gap-3 bg-euro-cream px-[18px] py-4 ${shake ? "animate-[nudge_0.4s_ease]" : ""}`}
          >
            <span className="euro-label text-xs text-euro-ink">Sold out for {dayLabel(order.date).toLowerCase()}</span>
            <span className="text-[13.5px] leading-relaxed text-euro-text">
              This one has sold out for {dayLabel(order.date).toLowerCase()}. You can still pre-order it for{" "}
              {dayLabel(nextDay).toLowerCase()} or a later day.
            </span>
            <button
              type="button"
              onClick={() => order.setWhen(nextDay)}
              className="euro-label h-10 self-start border border-euro-ink bg-white px-[18px] text-[11px] text-euro-ink hover:bg-euro-tint"
            >
              Order for {dayLabel(nextDay).toLowerCase()}
            </button>
          </div>
        )}

        {item.groups.map((g) => {
          const isMissing = tried && !picks[g.id];
          return (
            <fieldset key={g.id} className="flex flex-col gap-2.5">
              <legend className="flex w-full items-center justify-between pb-2.5">
                <span className="euro-label text-xs text-euro-ink">{g.title}</span>
                <span
                  className={`px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                    picks[g.id] ? "bg-euro-tint text-euro-muted" : "bg-euro-ink text-white"
                  }`}
                >
                  {picks[g.id] ? "Done" : "Required"}
                </span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {g.choices.map((c) => {
                  const on = picks[g.id] === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPicks((p) => ({ ...p, [g.id]: c.id }))}
                      className={`min-h-11 border border-euro-ink px-4 text-[13px] tracking-[0.04em] transition-colors ${
                        on ? "bg-euro-ink text-white" : "bg-white text-euro-ink hover:bg-euro-tint"
                      }`}
                    >
                      {c.name}
                      {c.priceCents > 0 && ` +${formatPrice(c.priceCents, currency)}`}
                    </button>
                  );
                })}
              </div>
              {isMissing && (
                <span role="alert" className="text-[13px] font-medium text-euro-ink">
                  Please choose {g.title.toLowerCase()} first.
                </span>
              )}
            </fieldset>
          );
        })}

        {item.addOns.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-1">
            <span className="w-full text-[11px] uppercase tracking-[0.16em] text-euro-muted">Add-ons (optional)</span>
            {item.addOns.map((a) => {
              const on = addOns.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAddOns((list) => (on ? list.filter((x) => x !== a.id) : [...list, a.id]))}
                  className="flex min-h-11 items-center gap-2.5 text-[13px] text-euro-text"
                >
                  <span className={`flex h-[17px] w-[17px] items-center justify-center border border-euro-ink ${on ? "bg-euro-ink" : "bg-white"}`}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                  </span>
                  {a.name}
                  {a.priceCents > 0 && <span className="text-euro-muted">+{formatPrice(a.priceCents, currency)}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2.5 border-t border-euro-line pt-[18px]">
          <span className="euro-label text-[11px] text-euro-ink">Pickup or delivery</span>
          <ModeToggle size="lg" />
          <div className="flex items-center justify-between gap-3 text-[13px] text-euro-soft">
            <span>
              {dayLabel(order.date)}
              {order.time && `, ${order.time}`}
              {order.mode === "pickup" ? " · 974 High St" : " · $5 per km"}
            </span>
            <button
              type="button"
              onClick={onChangeTime}
              className="min-h-9 text-xs uppercase tracking-[0.08em] text-euro-ink underline underline-offset-4"
            >
              Change time
            </button>
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="flex items-center border border-euro-line">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="h-[50px] w-11 text-lg text-euro-ink">
              −
            </button>
            <span className="w-[22px] text-center tabular-nums" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="h-[50px] w-11 text-lg text-euro-ink">
              +
            </button>
          </div>
          <button
            key={`add-${shake}`}
            type="button"
            onClick={add}
            className={`flex h-[52px] flex-1 items-center justify-between border-2 px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors ${
              soldOut ? "border-[#A6A9BE] bg-[#A6A9BE]" : "border-euro-edge bg-euro-accent hover:bg-euro-ink"
            } ${shake ? "animate-[nudge_0.45s_ease]" : ""}`}
          >
            <span>Add to bag</span>
            <span className="tracking-[0.06em]">{formatPrice(unitCents * qty, currency)}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setDetails((d) => !d)}
          aria-expanded={details}
          className="min-h-10 self-start text-xs uppercase tracking-[0.1em] text-euro-soft underline underline-offset-4"
        >
          {details ? "Hide allergens & details" : "Allergens & details"}
        </button>
        {details && (
          <div className="flex flex-col border-t border-euro-line text-[13px] leading-relaxed text-euro-soft">
            <div className="flex gap-4 border-b border-euro-line py-3">
              <span className="flex-[0_0_84px] pt-0.5 text-[10.5px] uppercase tracking-[0.16em] text-euro-ink">Allergens</span>
              <span>Ask us about allergens. Made in a kitchen that handles nuts, gluten, dairy and eggs.</span>
            </div>
            <div className="flex gap-4 border-b border-euro-line py-3">
              <span className="flex-[0_0_84px] pt-0.5 text-[10.5px] uppercase tracking-[0.16em] text-euro-ink">
                {order.mode === "pickup" ? "Pickup" : "Delivery"}
              </span>
              <span>
                {order.mode === "pickup"
                  ? "Free from 974 High St, Armadale. Open 7 days, 7am – 3pm."
                  : "$5 per km from our shop. Free on orders over $150."}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
