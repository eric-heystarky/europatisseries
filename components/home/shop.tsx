"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { Shop, ShopItem, ShopPack, ShopTab } from "@/lib/shop";
import { formatPrice } from "@/lib/format";
import { useCart } from "../cart-context";
import { addDays, dayLabel, firstOrderDay, todayIso, useOrder } from "../order-context";
import { ItemPanel } from "./item-panel";
import { WhenPicker } from "./when-picker";
import { SHOP_TAB_EVENT } from "./shop-events";

const CATERING = "catering";
// Phones get bottom sheets for the item panel and the day/time picker; desktop keeps them inline.
const PHONE = "(max-width: 767px)";
function useIsPhone() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(PHONE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(PHONE).matches,
    () => false,
  );
}

/** A panel that slides up from the bottom on phones, over a dimmed page; tapping outside closes it. */
function Sheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <>
      <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-[70] bg-euro-ink/35 animate-in fade-in duration-200" />
      <div className="fixed inset-x-0 bottom-0 z-[71] max-h-[88svh] overflow-y-auto overscroll-contain bg-white animate-in slide-in-from-bottom duration-300">
        {children}
      </div>
    </>
  );
}

// The homepage shows a taste of each category (two rows); the full list lives on /pre-order.
const HOME_LIMIT = 8;
const MENU_PAGE = "/pre-order";

/**
 * The menu: tabs, a calm product grid, and the Add to bag panel beside it. One
 * pickup/delivery + time setting covers the whole order. "home" is a short
 * preview that hands off to the full menu page; "full" lists everything, with
 * the tab bar pinned under the header and the tab kept in the URL.
 */
export function ShopSection({
  shop,
  variant = "home",
  initialTab,
}: {
  shop: Shop;
  variant?: "home" | "full";
  initialTab?: string;
}) {
  const full = variant === "full";
  const allTabs = [...shop.core, ...shop.more];
  const validTab = initialTab && (initialTab === CATERING || allTabs.some((t) => t.id === initialTab));
  const [tabId, setTabId] = useState(validTab ? initialTab : (shop.core[0]?.id ?? CATERING));
  const [showMore, setShowMore] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const order = useOrder();
  const isPhone = useIsPhone();

  const tab = allTabs.find((t) => t.id === tabId) ?? null;
  const openItem = tab?.items.find((i) => i.id === openId) ?? null;
  const shown = tab && !full ? tab.items.slice(0, HOME_LIMIT) : (tab?.items ?? []);

  const pick = useCallback(
    (id: string) => {
      setTabId(id);
      setOpenId(null);
      if (full) {
        window.history.replaceState(null, "", `?tab=${id}`);
        if (window.scrollY > (sectionRef.current?.offsetTop ?? 0)) {
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [full],
  );

  useEffect(() => {
    const onTab = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      pick(id);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(SHOP_TAB_EVENT, onTab);
    return () => window.removeEventListener(SHOP_TAB_EVENT, onTab);
  }, [pick]);

  const closeCal = useCallback(() => setCalOpen(false), []);
  const closePanel = useCallback(() => setOpenId(null), []);
  // On phones the item sheet hands over to the picker sheet (one sheet at a time).
  const panelToPicker = useCallback(() => {
    setOpenId(null);
    setCalOpen(true);
  }, []);
  const moreActive = shop.more.some((t) => t.id === tabId);

  return (
    <section
      ref={sectionRef}
      id="shop"
      className={`relative flex scroll-mt-[108px] flex-col gap-9 px-6 md:px-12 ${full ? "pb-24 pt-10 md:pt-14" : "py-20 md:py-24"}`}
    >
      {full && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="euro-eyebrow text-euro-muted">Order online · pickup or delivery</p>
          <h1 className="euro-heading mr-[-0.2em] text-[clamp(28px,3vw,40px)] tracking-[0.2em] text-euro-ink">Menu</h1>
        </div>
      )}
      <div
        className={`relative flex flex-wrap items-center justify-between gap-x-8 gap-y-4 ${
          full ? "sticky top-[96px] z-30 -mx-6 border-b border-euro-line bg-white/95 px-6 py-2 backdrop-blur md:top-[104px] md:-mx-12 md:px-12" : ""
        }`}
      >
        {/* Phones: one swipeable row with every category. Desktop: core tabs, the rest behind "More +". */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="-mx-6 flex w-[calc(100%+3rem)] flex-nowrap gap-x-7 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:w-auto md:flex-wrap md:gap-x-8 md:gap-y-2 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {[...shop.core.map((t) => ({ id: t.id, name: t.name })), { id: CATERING, name: "Catering" }].map((t) => (
            <TabButton key={t.id} on={t.id === tabId} onClick={() => pick(t.id)}>
              {t.name}
            </TabButton>
          ))}
          {shop.more.map((t) => (
            <TabButton
              key={t.id}
              on={t.id === tabId}
              onClick={() => pick(t.id)}
              className={showMore || moreActive ? "" : "md:hidden"}
            >
              {t.name}
            </TabButton>
          ))}
          {!moreActive && shop.more.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMore((m) => !m)}
              aria-expanded={showMore}
              className="hidden min-h-10 whitespace-nowrap text-xs uppercase tracking-[0.12em] text-euro-muted hover:text-euro-ink md:block"
            >
              {showMore ? "Less" : "More +"}
            </button>
          )}
        </div>

        {/* Phones: the pickup/delivery + time bar comes first, full width, above the tabs. */}
        <div className="order-first flex w-full items-center gap-7 border-b border-euro-line pb-2 md:order-none md:w-auto md:border-0 md:pb-0">
          <button
            type="button"
            onClick={() => setCalOpen((o) => !o)}
            aria-expanded={calOpen}
            className="flex min-h-11 flex-1 items-center justify-between gap-2 text-xs uppercase tracking-[0.12em] text-euro-ink md:min-h-10 md:flex-none md:justify-start"
          >
            {order.date ? order.label : "Pickup"}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d={calOpen ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
            </svg>
          </button>
          {!full && (
            <Link href={`${MENU_PAGE}?tab=${tabId}`} className="hidden items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-euro-muted hover:text-euro-ink md:flex">
              Full menu
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </Link>
          )}
        </div>

        {calOpen && !isPhone && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-20">
            <WhenPicker onDone={closeCal} />
          </div>
        )}
      </div>

      {tab ? (
        <div className="flex items-start gap-9">
          <div className="min-w-0 flex-1">
            {tab.layout === "grid" ? (
              <>
                <div
                  className={`grid gap-x-3 gap-y-11 ${
                    openItem && !isPhone ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {shown.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      currency={shop.currency}
                      open={item.id === openId}
                      dimmed={!!openItem && !isPhone && item.id !== openId}
                      onOpen={() => setOpenId(item.id === openId ? null : item.id)}
                    />
                  ))}
                </div>
                {shown.length < tab.items.length && (
                  <div className="mt-14 flex justify-center">
                    <Link href={`${MENU_PAGE}?tab=${tab.id}`} className="btn-euro-outline text-euro-ink hover:bg-euro-ink hover:text-white">
                      View all {tab.name.toLowerCase()} ({tab.items.length})
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <ListLayout tab={tab} currency={shop.currency} openId={openId} onOpen={(id) => setOpenId(id === openId ? null : id)} />
            )}
          </div>

          {openItem && !isPhone && (
            <div
              className={`sticky w-[46%] max-w-[620px] flex-none overflow-y-auto ${
                full ? "top-[176px] max-h-[calc(100vh-192px)]" : "top-[120px] max-h-[calc(100vh-136px)]"
              }`}
            >
              <ItemPanel
                key={openItem.id}
                item={openItem}
                currency={shop.currency}
                position={`${tab.name} · ${tab.items.indexOf(openItem) + 1} of ${tab.items.length}`}
                onClose={closePanel}
                onChangeTime={() => setCalOpen(true)}
              />
            </div>
          )}
        </div>
      ) : (
        <Catering packs={shop.packs} currency={shop.currency} onChangeTime={() => setCalOpen(true)} />
      )}

      {isPhone && calOpen && (
        <Sheet onClose={closeCal}>
          <WhenPicker onDone={closeCal} />
        </Sheet>
      )}
      {isPhone && openItem && tab && (
        <Sheet onClose={closePanel}>
          <ItemPanel
            key={openItem.id}
            item={openItem}
            currency={shop.currency}
            position={`${tab.name} · ${tab.items.indexOf(openItem) + 1} of ${tab.items.length}`}
            onClose={closePanel}
            onChangeTime={panelToPicker}
          />
        </Sheet>
      )}

      {shop.source === "sample" && (
        <p className="text-center text-[11px] uppercase tracking-[0.14em] text-euro-muted">
          Preview menu · live prices and stock load from Square once it&apos;s connected
        </p>
      )}
    </section>
  );
}

function TabButton({
  on,
  onClick,
  className = "",
  children,
}: {
  on: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className={`min-h-10 flex-none whitespace-nowrap border-b text-[12.5px] uppercase tracking-[0.12em] transition-colors ${className} ${
        on ? "border-euro-ink text-euro-ink" : "border-transparent text-[#6B7096] hover:text-euro-ink"
      }`}
    >
      {children}
    </button>
  );
}

function ProductCard({
  item,
  currency,
  open,
  dimmed,
  onOpen,
}: {
  item: ShopItem;
  currency: string;
  open: boolean;
  dimmed: boolean;
  onOpen: () => void;
}) {
  const { lines } = useCart();
  const order = useOrder();
  const soldOut = !!item.soldOutToday && order.isFirstDay;
  const nextDay = dayLabel(addDays(firstOrderDay(), 1)).toLowerCase();
  const inBag = lines.some((l) => l.itemId === item.id);
  const hasSizes = item.groups.some((g) => g.kind === "variation");

  return (
    <article className="group flex flex-col gap-3.5 transition-opacity duration-300" style={{ opacity: dimmed ? 0.55 : 1 }}>
      <div
        className={`relative aspect-[4/5] overflow-hidden bg-euro-cream outline-offset-[3px] ${
          open ? "outline outline-1 outline-euro-ink" : ""
        }`}
      >
        <button type="button" onClick={onOpen} aria-label={`View details for ${item.name}`} className="absolute inset-0">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              style={{ opacity: soldOut ? 0.8 : 1 }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-6 text-center text-xs font-light uppercase tracking-[0.2em] text-euro-muted">
              {item.name}
            </span>
          )}
        </button>
        {item.soldOutToday && (
          <span className="pointer-events-none absolute left-3 top-3 bg-white/90 px-2.5 py-[5px] text-[10px] font-medium uppercase tracking-[0.14em] text-euro-ink">
            {soldOut ? `Sold out ${dayLabel(order.date).toLowerCase()}` : `Available ${dayLabel(order.date).toLowerCase()}`}
          </span>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-x-4 bottom-4 h-[42px] translate-y-2 bg-white text-[12.5px] uppercase tracking-[0.08em] text-euro-soft opacity-0 transition-all duration-300 hover:text-euro-ink focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {soldOut ? `Pre-order for ${nextDay}` : inBag ? "In your bag · add more" : "Add to bag"}
        </button>
      </div>
      <button type="button" onClick={onOpen} className="flex flex-col gap-1.5 text-left">
        <span className="euro-label text-euro-ink">{item.name}</span>
        <span className="text-[12.5px] text-euro-soft">
          {soldOut ? `Sold out · available ${nextDay}` : `${hasSizes ? "From " : ""}${formatPrice(item.fromCents, currency)}`}
        </span>
      </button>
    </article>
  );
}

function ListLayout({
  tab,
  currency,
  openId,
  onOpen,
}: {
  tab: ShopTab;
  currency: string;
  openId: string | null;
  onOpen: (id: string) => void;
}) {
  const { lines } = useCart();
  return (
    <div className={`grid border-t border-euro-line ${openId ? "grid-cols-1" : "grid-cols-1 gap-x-14 lg:grid-cols-2"}`}>
      {tab.items.map((item) => {
        const on = item.id === openId;
        const added = lines.some((l) => l.itemId === item.id);
        const hasChoices = item.groups.length > 0 || item.addOns.length > 0;
        return (
          <div
            key={item.id}
            className={`flex min-h-[62px] items-center gap-3.5 border-b border-euro-line transition-colors ${on ? "bg-euro-cream px-3.5" : ""}`}
          >
            <button type="button" onClick={() => onOpen(item.id)} className="flex min-h-[60px] flex-1 flex-col justify-center gap-0.5 text-left">
              <span className="euro-label text-euro-ink">{item.name}</span>
              {hasChoices && <span className="text-xs text-euro-soft">Choose options &amp; add-ons</span>}
            </button>
            <span className="text-[13px] text-euro-soft">{formatPrice(item.fromCents, currency)}</span>
            <button
              type="button"
              onClick={() => onOpen(item.id)}
              aria-label={`Add ${item.name} to bag`}
              className={`flex h-[38px] w-[38px] items-center justify-center rounded-full border border-euro-ink ${
                added ? "bg-euro-ink text-white" : "bg-white text-euro-ink"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d={added ? "m5 12 5 5 9-10" : "M12 5v14M5 12h14"} />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Catering({ packs, currency, onChangeTime }: { packs: ShopPack[]; currency: string; onChangeTime: () => void }) {
  const [guests, setGuests] = useState(10);
  const { addLine } = useCart();
  const order = useOrder();
  const tooSoon = order.date === todayIso();

  function addPack(pack: ShopPack) {
    for (const l of pack.lines) {
      addLine(
        {
          itemId: l.itemId,
          itemName: l.name,
          variationId: l.variationId,
          variationName: l.variationName,
          basePriceCents: l.unitCents,
          modifiers: [],
          imageUrl: l.imageUrl ?? undefined,
        },
        l.qty,
      );
    }
    toast.success(`${pack.title} added to your bag`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-5 bg-euro-cream px-7 py-[22px]">
        <div className="flex items-center gap-[18px]">
          <span className="euro-label text-xs text-euro-ink">How many guests?</span>
          <div className="flex items-center border border-euro-ink bg-white">
            <button type="button" onClick={() => setGuests((g) => Math.max(4, g - 2))} aria-label="Fewer guests" className="h-[46px] w-11 text-lg text-euro-ink">−</button>
            <span className="min-w-11 text-center text-xl font-light text-euro-ink tabular-nums">{guests}</span>
            <button type="button" onClick={() => setGuests((g) => g + 2)} aria-label="More guests" className="h-[46px] w-11 text-lg text-euro-ink">+</button>
          </div>
        </div>
        <span className="max-w-[460px] text-xs text-euro-soft">
          Ready-made platters, priced from our menu. Each one adds its pieces to your bag. $100 minimum, 24 hours notice.
        </span>
      </div>

      {tooSoon && (
        <p role="status" className="text-[13px] text-euro-ink">
          Catering needs 24 hours notice —{" "}
          <button type="button" onClick={onChangeTime} className="font-medium underline underline-offset-4">
            choose tomorrow or later
          </button>
          .
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-3 gap-y-11">
        {packs.map((p) => {
          const fits = Math.abs(p.servesCount - guests) <= 3;
          return (
            <article key={p.id} className="group flex flex-col gap-3.5">
              <div className="relative aspect-[4/3] overflow-hidden bg-euro-cream">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                )}
                {fits && (
                  <span className="absolute left-4 top-4 bg-white px-2.5 py-[7px] text-[10.5px] uppercase tracking-[0.14em] text-euro-ink">
                    Good for {guests} guests
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => addPack(p)}
                  className="absolute inset-x-4 bottom-4 h-[42px] translate-y-2 bg-white text-[12.5px] uppercase tracking-[0.08em] text-euro-soft opacity-0 transition-all duration-300 hover:text-euro-ink focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Add platter · {formatPrice(p.totalCents, currency)}
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="euro-label text-euro-ink">{p.title}</span>
                <span className="text-[12.5px] text-euro-soft">
                  {p.serves} · {formatPrice(p.totalCents, currency)}
                </span>
                <span className="text-[13px] leading-relaxed text-euro-text">{p.blurb}</span>
              </div>
            </article>
          );
        })}
      </div>
      <p className="text-center text-xs uppercase tracking-[0.1em] text-euro-soft">
        $100 minimum per catering order · 24 hours notice · Free delivery over $150 ·{" "}
        <Link href="/catering" className="text-euro-ink underline underline-offset-4">
          Plan a bigger event
        </Link>
      </p>
    </div>
  );
}
