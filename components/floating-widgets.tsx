"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Mail, MessageCircle, MessageSquare, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/site";

/**
 * Bottom-right floating stack: a chat widget (call / SMS / email) plus a
 * scroll-to-top button that sits above it. They're one flex column anchored to
 * the bottom, so the FAB stays at the corner, the panel opens above it, and the
 * scroll-to-top hides while the chat is open — nothing overlaps.
 */
export function FloatingWidgets() {
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Digits-only for tel:/sms: (e.g. "+61 3 9822 1234" -> "+61398221234").
  const tel = BUSINESS.phone.replace(/[^\d+]/g, "");
  const options = [
    { icon: Phone, label: "Call us", sub: BUSINESS.phone, href: `tel:${tel}` },
    { icon: MessageSquare, label: "SMS us", sub: "Text your order", href: `sms:${tel}` },
    { icon: Mail, label: "Email us", sub: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  ];

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 md:right-8">
      {/* Scroll to top — only once scrolled and while the chat is closed */}
      {scrolled && !chatOpen && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="flex h-12 w-12 items-center justify-center border-2 border-primary bg-primary text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--primary))] transition-all duration-300 hover:-translate-y-1 hover:bg-background hover:text-primary"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      {/* Contact panel */}
      {chatOpen && (
        <div className="w-64 origin-bottom-right border-2 border-primary bg-card shadow-[6px_6px_0_0_hsl(var(--primary))]">
          <div className="border-b-2 border-primary bg-primary px-4 py-3 text-primary-foreground">
            <p className="font-serif text-sm font-bold uppercase tracking-wide">Get in touch</p>
            <p className="mt-0.5 text-[11px] text-primary-foreground/70">
              Order or ask us anything
            </p>
          </div>
          <div className="divide-y-2 divide-primary/15">
            {options.map((o) => (
              <a
                key={o.label}
                href={o.href}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5"
              >
                <o.icon className="h-5 w-5 flex-none text-primary" strokeWidth={1.75} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold uppercase tracking-wide">{o.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{o.sub}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Chat FAB */}
      <button
        type="button"
        onClick={() => setChatOpen((v) => !v)}
        aria-label={chatOpen ? "Close contact options" : "Contact us"}
        aria-expanded={chatOpen}
        className="flex h-14 w-14 items-center justify-center border-2 border-primary bg-primary text-primary-foreground shadow-[4px_4px_0_0_hsl(var(--primary))] transition-all duration-300 hover:-translate-y-1 hover:bg-background hover:text-primary"
      >
        {chatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
