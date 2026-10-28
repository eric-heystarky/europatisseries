"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * How and when the whole order is fulfilled — one setting for the bag, not per
 * item. Changing it anywhere (item panel, calendar, sold-out prompt) moves the
 * whole order. Persisted so checkout picks up the same choice.
 */
export type FulfilMode = "pickup" | "delivery";
export type OrderTiming = { mode: FulfilMode; date: string; time: string };

export const OPEN_MIN = 7 * 60;
export const CLOSE_MIN = 15 * 60;
/** Orders need this long before closing to be ready the same day. */
const LEAD_MIN = 20;

export function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(iso: string, n: number): string {
  const d = parseIso(iso);
  d.setDate(d.getDate() + n);
  return isoDate(d);
}
export function todayIso(): string {
  return isoDate(new Date());
}
export function minutesNow(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}
export function fmtMinutes(m: number): string {
  const h = Math.floor(m / 60), mm = m % 60;
  return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")}${h < 12 ? "am" : "pm"}`;
}

/** The first day an order can still be fulfilled (today, unless we're past cut-off). */
export function firstOrderDay(): string {
  return minutesNow() >= CLOSE_MIN - LEAD_MIN ? addDays(todayIso(), 1) : todayIso();
}

/** Half-hourly slots for a day; today only offers ASAP + slots still ahead. */
export function slotsFor(date: string): string[] {
  const out: string[] = [];
  const today = date === todayIso();
  const now = minutesNow();
  if (today && now >= OPEN_MIN && now < CLOSE_MIN - LEAD_MIN) out.push("ASAP");
  for (let m = OPEN_MIN; m < CLOSE_MIN; m += 30) {
    if (today && m < now + LEAD_MIN) continue;
    out.push(fmtMinutes(m));
  }
  return out;
}

/** "Today", "Tomorrow", or "Thursday 6 Nov". */
export function dayLabel(date: string): string {
  if (date === todayIso()) return "Today";
  if (date === addDays(todayIso(), 1)) return "Tomorrow";
  return parseIso(date).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "short" });
}

function defaultTiming(): OrderTiming {
  const date = firstOrderDay();
  return { mode: "pickup", date, time: slotsFor(date)[0] ?? fmtMinutes(OPEN_MIN) };
}

type OrderContextValue = OrderTiming & {
  setMode: (m: FulfilMode) => void;
  setWhen: (date: string, time?: string) => void;
  setTime: (t: string) => void;
  /** Is the order set for the first available day? (sold-out-today applies only then) */
  isFirstDay: boolean;
  label: string;
};

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = "order-timing-v1";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [timing, setTiming] = useState<OrderTiming>(() => ({ mode: "pickup", date: "", time: "" }));

  // Resolve on the client (dates depend on the visitor's clock) and drop stale saved days.
  useEffect(() => {
    let next = defaultTiming();
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as OrderTiming | null;
      if (saved && saved.date >= firstOrderDay()) {
        const slots = slotsFor(saved.date);
        next = { ...saved, time: slots.includes(saved.time) ? saved.time : slots[0] ?? next.time };
      }
    } catch {
      /* ignore corrupt storage */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from the visitor's clock + storage once
    setTiming(next);
  }, []);

  useEffect(() => {
    if (!timing.date) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timing));
    } catch {
      /* storage may be unavailable */
    }
  }, [timing]);

  const value = useMemo<OrderContextValue>(() => {
    const date = timing.date || todayIso();
    return {
      ...timing,
      date,
      setMode: (mode) => setTiming((t) => ({ ...t, mode })),
      setWhen: (d, time) =>
        setTiming((t) => {
          const slots = slotsFor(d);
          return { ...t, date: d, time: time ?? (slots.includes(t.time) ? t.time : slots[0] ?? "") };
        }),
      setTime: (time) => setTiming((t) => ({ ...t, time })),
      isFirstDay: date === firstOrderDay(),
      label: `${timing.mode === "pickup" ? "Pickup" : "Delivery"} · ${dayLabel(date)}${timing.time ? `, ${timing.time}` : ""}`,
    };
  }, [timing]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within <OrderProvider>");
  return ctx;
}
