"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FIELD, LABEL, TEXTAREA } from "@/components/form-styles";
import { BUSINESS } from "@/lib/site";
import { submitLeadForm } from "@/lib/submitForm";

const INITIAL_FORM = { name: "", email: "", message: "" };

const DETAILS = [
  {
    label: "Visit us",
    lines: ["974 High St", "Armadale VIC 3143"],
    link: { href: "https://maps.google.com/?q=974+High+St+Armadale+VIC+3143", text: "Get directions" },
  },
  { label: "Hours", lines: ["Open 7 days", "7am – 3pm"] },
  {
    label: "Contact",
    lines: [BUSINESS.email, "(03) 9822 1234"],
    link: { href: `mailto:${BUSINESS.email}`, text: "Email us" },
  },
];

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof INITIAL_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitLeadForm("contact", form);
    if (ok) setForm(INITIAL_FORM);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col bg-white md:flex-row">
      {/* Details */}
      <AnimatedSection className="flex w-full flex-col justify-center gap-10 px-6 py-16 md:w-1/2 md:px-16 md:py-24 lg:px-24">
        <div className="flex flex-col gap-4">
          <p className="euro-eyebrow text-euro-muted">Contact</p>
          <h1 className="euro-heading text-[clamp(30px,3.4vw,48px)] text-euro-ink">Get in touch</h1>
          <p className="max-w-[420px] text-[15px] leading-[1.8] text-euro-soft">
            Questions, custom cakes or catering — drop in, call, or send us a message and we&apos;ll get back to you.
          </p>
        </div>

        <ul className="max-w-[460px] divide-y divide-euro-line border-y border-euro-line">
          {DETAILS.map((d) => (
            <li key={d.label} className="grid gap-1.5 py-6 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8">
              <span className="pt-[3px] text-[10.5px] font-medium uppercase tracking-[0.2em] text-euro-muted">{d.label}</span>
              <span className="flex flex-col gap-2">
                <span className="text-[15px] font-light leading-[1.7] text-euro-ink">
                  {d.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </span>
                {d.link && (
                  <a
                    href={d.link.href}
                    target={d.link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="w-fit text-[11px] font-medium uppercase tracking-[0.18em] text-euro-ink underline underline-offset-[6px] hover:opacity-70"
                  >
                    {d.link.text}
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </AnimatedSection>

      {/* Form */}
      <AnimatedSection
        delay={0.15}
        className="flex w-full flex-col justify-center bg-euro-tint px-6 py-16 md:w-1/2 md:px-16 md:py-24 lg:px-24"
      >
        <p className="euro-eyebrow text-euro-muted">Write to us</p>
        <h2 className="euro-heading mt-4 text-[clamp(24px,2.4vw,32px)] text-euro-ink">Send a message</h2>

        <form className="mt-8 flex max-w-[480px] flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="contact-name" className={LABEL}>
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange("name")}
              required
              autoComplete="name"
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={LABEL}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              autoComplete="email"
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className={LABEL}>
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange("message")}
              required
              className={TEXTAREA}
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-euro mt-2 w-full">
            {isSubmitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </AnimatedSection>
    </div>
  );
}
