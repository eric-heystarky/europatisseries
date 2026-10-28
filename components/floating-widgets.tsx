"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Mail, MessageSquare, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";

/**
 * Bottom-right floating stack: a quiet contact button (call / SMS / email) with
 * a back-to-top square above it. One flex column anchored to the corner, so the
 * panel opens above the button and back-to-top hides while it's open.
 */
export function FloatingWidgets() {
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Digits-only for tel:/sms: (e.g. "+61 3 9822 1234" -> "+61398221234").
  const tel = BUSINESS.phone.replace(/[^\d+]/g, "");
  const options = [
    { icon: Phone, label: "Call", sub: BUSINESS.phone, href: `tel:${tel}` },
    { icon: MessageSquare, label: "Text", sub: "Message your order", href: `sms:${tel}` },
    { icon: Mail, label: "Email", sub: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  ];

  return (
    // Desktop only: on phones the sticky header covers "back to top" (and iOS scrolls up on a
    // status-bar tap), Contact lives in the side menu and footer, and the bottom of the screen
    // belongs to the order bar (see mobile-order-bar).
    <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-2 md:flex">
      {/* Back to top — only once well down the page, and while contact is closed */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        tabIndex={scrolled && !chatOpen ? 0 : -1}
        className={`flex h-11 w-11 items-center justify-center border border-euro-line bg-white/90 text-euro-ink backdrop-blur transition-all duration-300 hover:border-euro-ink ${
          scrolled && !chatOpen ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={1.4} />
      </button>

      {/* Contact panel */}
      {chatOpen && (
        <div className="w-[260px] animate-in fade-in slide-in-from-bottom-2 border border-euro-line bg-white shadow-[0_12px_40px_rgba(5,9,48,0.12)] duration-200">
          <div className="border-b border-euro-line px-5 py-4">
            <p className="euro-label text-euro-ink">Get in touch</p>
            <p className="mt-1 text-[12.5px] text-euro-soft">Questions, orders or catering</p>
          </div>
          <div className="divide-y divide-euro-line">
            {options.map((o) => (
              <a
                key={o.label}
                href={o.href}
                className="flex items-center gap-3.5 px-5 py-3.5 text-euro-ink transition-colors hover:bg-euro-tint"
              >
                <o.icon className="h-[18px] w-[18px] flex-none" strokeWidth={1.4} />
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em]">{o.label}</span>
                  <span className="block truncate text-[12.5px] text-euro-soft">{o.sub}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Contact button */}
      <button
        type="button"
        onClick={() => setChatOpen((v) => !v)}
        aria-label={chatOpen ? "Close contact options" : "Contact us"}
        aria-expanded={chatOpen}
        className="flex h-11 min-w-11 items-center justify-center gap-2.5 bg-euro-ink px-3.5 text-white shadow-[0_8px_24px_rgba(5,9,48,0.18)] transition-colors hover:bg-euro-accent md:px-4"
      >
        {chatOpen ? (
          <X className="h-4 w-4" strokeWidth={1.4} />
        ) : (
          <Phone className="h-4 w-4" strokeWidth={1.4} />
        )}
        {/* Icon-only on phones, where the label would sit over the product grid. */}
        <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.2em] md:inline">{chatOpen ? "Close" : "Contact"}</span>
      </button>
    </div>
  );
}
