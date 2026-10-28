"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FIELD, LABEL, TEXTAREA } from "@/components/form-styles";
import { BTN_ON_PHOTO, PhotoHero } from "@/components/split";
import { submitLeadForm } from "@/lib/submitForm";

const INITIAL_FORM = { name: "", email: "", role: "", about: "" };

const TEAM_PHOTO =
  "https://vibe.filesafe.space/1782359074813107391/attachments/982a14ae-934a-417e-828f-386be0dadded.png";

const PERKS = [
  {
    title: "Great perks",
    body: "Free coffee, daily pastry allowances, and a generous staff discount for you and your family.",
  },
  {
    title: "Fun team",
    body: "We take our work seriously, but not ourselves. Expect a fast-paced, energetic environment with plenty of laughs.",
  },
  {
    title: "Growth",
    body: "Whether you want to master the art of lamination or manage a store, we provide training and clear paths for career progression.",
  },
];

export default function JoinTeam() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof INITIAL_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await submitLeadForm("join-team", form);
    if (ok) setForm(INITIAL_FORM);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white">
      <PhotoHero img={TEAM_PHOTO} alt="The Euro Patisserie team at work in the café" eyebrow="Careers" title="Join the team">
        <p className="max-w-[600px] text-[15px] leading-[1.8] text-white/90">
          Whether you&apos;re behind the counter, rolling a croissant or slinging back a flat white, we want to hear from
          you.
        </p>
        <a href="#apply" className={`${BTN_ON_PHOTO} mt-3`}>
          Apply now
        </a>
      </PhotoHero>

      {/* Intro */}
      <AnimatedSection className="mx-auto max-w-[760px] px-6 py-20 text-center md:py-24">
        <p className="text-[clamp(17px,1.6vw,21px)] font-light leading-[1.7] text-euro-text">
          We&apos;re always on the lookout for great people to join the team. If you&apos;re passionate about pastries, love
          working in a fast-paced environment and enjoy making people&apos;s day a little sweeter, we&apos;d love to hear
          from you.
        </p>
      </AnimatedSection>

      {/* Why us + application */}
      <section id="apply" className="scroll-mt-[120px] flex flex-col md:flex-row">
        <AnimatedSection className="flex w-full flex-col justify-center gap-8 px-6 py-16 md:w-1/2 md:px-16 md:py-24 lg:px-24">
          <div className="flex flex-col gap-4">
            <p className="euro-eyebrow text-euro-muted">Why Euro Patisserie</p>
            <h2 className="euro-heading text-[clamp(24px,2.4vw,34px)] text-euro-ink">A sweeter place to work</h2>
          </div>
          <ul className="max-w-[460px] divide-y divide-euro-line border-y border-euro-line">
            {PERKS.map((p) => (
              <li key={p.title} className="flex flex-col gap-1.5 py-6">
                <span className="euro-label text-euro-ink">{p.title}</span>
                <span className="text-[14px] leading-[1.75] text-euro-soft">{p.body}</span>
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <AnimatedSection
          delay={0.15}
          className="flex w-full flex-col justify-center bg-euro-tint px-6 py-16 md:w-1/2 md:px-16 md:py-24 lg:px-24"
        >
          <p className="euro-eyebrow text-euro-muted">Apply</p>
          <h2 className="euro-heading mt-4 text-[clamp(24px,2.4vw,32px)] text-euro-ink">Apply now</h2>
          <form className="mt-8 flex max-w-[480px] flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="apply-name" className={LABEL}>
                Name
              </label>
              <input id="apply-name" name="name" value={form.name} onChange={handleChange("name")} required autoComplete="name" placeholder="Your name" className={FIELD} />
            </div>
            <div>
              <label htmlFor="apply-email" className={LABEL}>
                Email
              </label>
              <input id="apply-email" name="email" type="email" value={form.email} onChange={handleChange("email")} required autoComplete="email" placeholder="your@email.com" className={FIELD} />
            </div>
            <div>
              <label htmlFor="apply-role" className={LABEL}>
                Role of interest
              </label>
              <input id="apply-role" name="role" value={form.role} onChange={handleChange("role")} required placeholder="e.g. Pastry chef, barista" className={FIELD} />
            </div>
            <div>
              <label htmlFor="apply-about" className={LABEL}>
                Tell us about yourself
              </label>
              <textarea id="apply-about" name="about" value={form.about} onChange={handleChange("about")} required placeholder="Why do you want to join?" className={TEXTAREA} />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-euro mt-2 w-full">
              {isSubmitting ? "Sending…" : "Submit application"}
            </button>
          </form>
        </AnimatedSection>
      </section>
    </div>
  );
}
