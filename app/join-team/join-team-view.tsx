"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/AnimatedSection";
import { submitLeadForm } from "@/lib/submitForm";

const INITIAL_FORM = { name: "", email: "", role: "", about: "" };

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
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Interested in joining? — page intro */}
      <section className="relative py-16 md:py-32 px-4 md:px-8 bg-primary text-primary-foreground overflow-hidden border-b-2 border-primary">
        {/* Wavy text background */}
        <div
          className="absolute top-0 left-0 w-[200%] md:w-full h-48 md:h-64 opacity-80 pointer-events-none"
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <path id="wavePath" d="M 0 150 Q 250 50 500 150 T 1000 150 T 1500 150 T 2000 150" fill="transparent" stroke="transparent" />
            <text className="font-sans text-5xl md:text-6xl font-light uppercase tracking-widest" fill="currentColor">
              <textPath href="#wavePath" startOffset="0%">
                JOIN THE TEAM JOIN THE TEAM JOIN THE TEAM JOIN THE TEAM JOIN THE TEAM
                <animate attributeName="startOffset" from="0%" to="-50%" begin="0s" dur="20s" repeatCount="indefinite" />
              </textPath>
            </text>
          </svg>
        </div>

        <AnimatedSection className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-center text-center mt-28 md:mt-16">
          <div className="w-full md:w-2/3 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium uppercase tracking-tight leading-tight mb-6 md:mb-8">
              Interested in joining<br/>Euro Patisserie?
            </h1>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg font-light mb-8 md:mb-10 max-w-2xl text-left md:text-center">
              <p className="flex items-start md:justify-center text-left md:text-center">
                <span className="mr-2 mt-1 hidden md:inline">↳</span>
                We&apos;re always on the lookout for great people to join the team. If you&apos;re passionate about pastries, love working in a fast-paced environment and enjoy making people&apos;s day a little sweeter, we&apos;d love to hear from you.
              </p>
              <p>
                Whether you&apos;re behind the counter, rolling a croissant or slinging back a flat white, we want to hear from you!
              </p>
            </div>
            <Button asChild size="lg" className="bg-background text-primary hover:bg-transparent hover:text-background hover:border-background hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--background))] text-sm font-bold uppercase tracking-widest rounded-none border-2 border-transparent px-8 py-6 md:px-12 md:py-6 transition-all duration-300 w-full sm:w-auto">
              <Link href="#apply">Apply Here</Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Content */}
      <section id="apply" className="scroll-mt-28 py-24 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

          <AnimatedSection>
            <h2 className="text-5xl font-shorelines mb-8">
              Why Euro Patisserie?
            </h2>
            <div className="space-y-8 text-lg">
              <div>
                <h3 className="font-bold text-xl uppercase mb-2">Great Perks</h3>
                <p className="text-muted-foreground">Free coffee, daily pastry allowances, and a generous staff discount for you and your family.</p>
              </div>
              <div>
                <h3 className="font-bold text-xl uppercase mb-2">Fun Team</h3>
                <p className="text-muted-foreground">We take our work seriously, but not ourselves. Expect a fast-paced, energetic environment with plenty of laughs.</p>
              </div>
              <div>
                <h3 className="font-bold text-xl uppercase mb-2">Growth</h3>
                <p className="text-muted-foreground">Whether you want to master the art of lamination or manage a store, we provide training and clear paths for career progression.</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="bg-card border-2 border-primary p-8" delay={0.2}>
            <h2 className="text-4xl font-shorelines mb-6">
              Apply Now
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="apply-name" className="block text-sm font-bold uppercase tracking-widest mb-2">Name</label>
                <Input id="apply-name" name="name" value={form.name} onChange={handleChange("name")} required autoComplete="name" className="rounded-none border-2 border-primary" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="apply-email" className="block text-sm font-bold uppercase tracking-widest mb-2">Email</label>
                <Input id="apply-email" name="email" type="email" value={form.email} onChange={handleChange("email")} required autoComplete="email" className="rounded-none border-2 border-primary" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="apply-role" className="block text-sm font-bold uppercase tracking-widest mb-2">Role of Interest</label>
                <Input id="apply-role" name="role" value={form.role} onChange={handleChange("role")} required className="rounded-none border-2 border-primary" placeholder="e.g. Pastry Chef, Barista" />
              </div>
              <div>
                <label htmlFor="apply-about" className="block text-sm font-bold uppercase tracking-widest mb-2">Tell us about yourself</label>
                <Textarea id="apply-about" name="about" value={form.about} onChange={handleChange("about")} required className="rounded-none border-2 border-primary min-h-[120px]" placeholder="Why do you want to join?" />
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full rounded-none border-2 border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--primary))] uppercase tracking-widest py-6 text-lg font-bold transition-all duration-300 disabled:opacity-60">
                {isSubmitting ? "Sending..." : "Submit Application"}
              </Button>
            </form>
          </AnimatedSection>

        </div>
      </section>
    </div>
  );
}
