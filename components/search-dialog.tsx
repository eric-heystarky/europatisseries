"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { SearchEntry } from "@/app/api/search/route";

// Shown before anything is typed: straight into the main collections.
const SUGGESTIONS = [
  { label: "Croissant", q: "croissant" },
  { label: "Cakes & slices", tab: "cakes" },
  { label: "Pies", q: "pie" },
  { label: "Coffee", tab: "coffee" },
  { label: "Gift cards", href: "/gift-cards" },
];

// Accents and case don't matter ("eclair" finds "Éclair").
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Header search: a panel under the header with one big field. The menu index is
 * fetched once on first open; results filter instantly. Picking a result opens that
 * item on the menu page, ready to add to the bag.
 */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<{ currency: string; items: SearchEntry[] } | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  // Load the index the first time the panel opens.
  useEffect(() => {
    if (!open || index) return;
    let cancelled = false;
    fetch("/api/search")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !cancelled && setIndex(d))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [open, index]);

  // Focus the field, lock the page, and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = norm(q.trim());
    if (!index || term.length < 2) return [];
    const words = term.split(/\s+/);
    return index.items
      .filter((i) => {
        const hay = norm(`${i.name} ${i.tabName}`);
        return words.every((w) => hay.includes(w));
      })
      // Names that start with the search come first.
      .sort((a, b) => Number(norm(b.name).startsWith(term)) - Number(norm(a.name).startsWith(term)))
      .slice(0, 8);
  }, [index, q]);

  function go(href: string) {
    onClose();
    setQ("");
    router.push(href);
  }
  const openItem = (i: SearchEntry) => go(`/pre-order?tab=${i.tab}&item=${encodeURIComponent(i.id)}`);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search the menu">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-euro-ink/35 animate-in fade-in duration-200" />
      <div className="relative max-h-[85svh] overflow-y-auto bg-white shadow-[0_24px_60px_rgba(5,9,48,0.14)] animate-in slide-in-from-top-4 fade-in duration-300">
        <div className="mx-auto flex max-w-[860px] flex-col gap-7 px-6 pb-10 pt-8 md:px-12 md:pt-12">
          <div className="flex items-center gap-4 border-b border-euro-ink pb-3">
            <Search className="h-5 w-5 flex-none text-euro-ink" strokeWidth={1.4} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter" && results[active]) {
                  openItem(results[active]);
                }
              }}
              placeholder="Search the menu"
              aria-label="Search the menu"
              aria-controls="search-results"
              className="min-w-0 flex-1 bg-transparent text-[clamp(20px,2.4vw,28px)] font-light tracking-[0.02em] text-euro-ink outline-none placeholder:text-euro-muted/60"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="flex h-10 w-10 flex-none items-center justify-center text-euro-ink hover:opacity-70">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          {q.trim().length < 2 ? (
            <div className="flex flex-col gap-4">
              <p className="euro-eyebrow text-euro-muted">Popular</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => (s.q ? setQ(s.q) : go(s.href ?? `/pre-order?tab=${s.tab}`))}
                    className="h-10 border border-euro-line px-4 text-[11px] font-medium uppercase tracking-[0.16em] text-euro-ink transition-colors hover:border-euro-ink"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : failed ? (
            <p className="text-[14px] text-euro-soft">Search isn&apos;t available right now — try the full menu.</p>
          ) : !index ? (
            <p className="text-[14px] text-euro-soft">Searching…</p>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-start gap-4">
              <p className="text-[14px] text-euro-soft">Nothing found for &ldquo;{q.trim()}&rdquo;.</p>
              <button type="button" onClick={() => go("/pre-order")} className="btn-euro-outline text-euro-ink hover:bg-euro-ink hover:text-white">
                Browse the full menu
              </button>
            </div>
          ) : (
            <ul id="search-results" role="listbox" aria-label="Results" className="divide-y divide-euro-line border-y border-euro-line">
              {results.map((i, n) => (
                <li key={i.id} role="option" aria-selected={n === active}>
                  <button
                    type="button"
                    onClick={() => openItem(i)}
                    onMouseEnter={() => setActive(n)}
                    className={`flex w-full items-center gap-4 px-2 py-3 text-left transition-colors ${n === active ? "bg-euro-tint" : ""}`}
                  >
                    <span className="h-14 w-12 flex-none overflow-hidden bg-euro-cream">
                      {i.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={i.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-[13px] font-medium uppercase tracking-[0.12em] text-euro-ink">{i.name}</span>
                      <span className="text-[12px] text-euro-muted">{i.tabName}</span>
                    </span>
                    <span className="text-[13px] tabular-nums text-euro-soft">
                      {formatPrice(i.fromCents, index.currency)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
