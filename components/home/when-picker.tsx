"use client";

import { useEffect, useRef, useState } from "react";
import { addDays, dayLabel, firstOrderDay, isoDate, parseIso, slotsFor, useOrder } from "../order-context";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_DAYS_AHEAD = 30;

export function ModeToggle({ size = "md" }: { size?: "md" | "lg" }) {
  const { mode, setMode } = useOrder();
  const h = size === "lg" ? "h-11" : "h-[42px]";
  return (
    <div className="grid grid-cols-2 border border-euro-ink">
      {(["pickup", "delivery"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`${h} euro-label text-[11px] transition-colors ${
            mode === m ? "bg-euro-ink text-white" : "bg-white text-euro-ink hover:bg-euro-tint"
          }`}
        >
          {m === "pickup" ? "Pickup" : "Delivery"}
        </button>
      ))}
    </div>
  );
}

/** Calendar + time slots for the whole order. Rendered as a popover by the caller. */
export function WhenPicker({ onDone }: { onDone: () => void }) {
  const { date, time, setWhen, setTime } = useOrder();
  const first = firstOrderDay();
  const last = addDays(first, MAX_DAYS_AHEAD);
  const [month, setMonth] = useState(() => {
    const d = parseIso(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDone();
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDone();
    };
    window.addEventListener("keydown", onKey);
    // Defer so the click that opened the picker doesn't close it.
    const t = setTimeout(() => document.addEventListener("mousedown", onDown));
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onDone]);

  const lead = (month.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => isoDate(new Date(month.getFullYear(), month.getMonth(), i + 1))),
  ];
  const canPrev = isoDate(month) > first.slice(0, 8) + "01";
  const canNext = isoDate(new Date(month.getFullYear(), month.getMonth() + 1, 1)) <= last;
  const shiftMonth = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const slots = slotsFor(date);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Choose a day and time"
      className="flex w-full flex-wrap bg-white md:w-[620px] md:max-w-[calc(100vw-32px)] md:border md:border-euro-line md:shadow-[0_20px_40px_rgba(0,0,0,0.08)] md:animate-in md:fade-in md:slide-in-from-top-2 md:duration-200"
    >
      <div className="flex min-w-0 flex-[1_1_330px] flex-col gap-3.5 border-euro-line p-6 md:border-r">
        <ModeToggle />
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Previous month" className="flex h-9 w-9 items-center justify-center text-euro-ink disabled:opacity-25">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <span className="euro-label text-[13px] text-euro-ink">
            {month.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
          </span>
          <button type="button" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Next month" className="flex h-9 w-9 items-center justify-center text-euro-ink disabled:opacity-25">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1 text-[10px] uppercase tracking-[0.14em] text-euro-muted">{w}</span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} />;
            const disabled = d < first || d > last;
            const on = d === date;
            return (
              <button
                key={d}
                type="button"
                disabled={disabled}
                aria-pressed={on}
                aria-label={parseIso(d).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
                onClick={() => setWhen(d)}
                className={`h-[38px] text-[13px] transition-colors ${
                  on
                    ? "bg-euro-ink text-white"
                    : disabled
                      ? "cursor-not-allowed text-euro-line"
                      : "text-euro-text hover:bg-euro-tint"
                }`}
              >
                {parseIso(d).getDate()}
              </button>
            );
          })}
        </div>
        <span className="text-xs leading-normal text-euro-soft">
          Order up to 30 days ahead. Catering needs 24 hours notice.
        </span>
      </div>

      <div className="flex min-w-0 flex-[1_1_250px] flex-col gap-3 p-6">
        <span className="text-[11px] uppercase tracking-[0.16em] text-euro-soft">{dayLabel(date)}</span>
        {slots.length === 0 && (
          <span className="text-[13px] leading-relaxed text-euro-soft">
            We&apos;re closed for the rest of today (open 7am – 3pm). Pick another day.
          </span>
        )}
        <div className="grid max-h-[290px] grid-cols-2 gap-2 overflow-y-auto">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTime(s)}
              aria-pressed={s === time}
              className={`h-10 border border-euro-ink text-[12.5px] transition-colors ${
                s === time ? "bg-euro-ink text-white" : "bg-white text-euro-ink hover:bg-euro-tint"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button type="button" onClick={onDone} className="btn-euro mt-auto w-full">
          Done
        </button>
      </div>
    </div>
  );
}
