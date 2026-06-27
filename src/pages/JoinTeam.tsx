import { useState } from "react";
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
      {/* Hero */}
      <AnimatedSection className="bg-[#682a32] text-white py-24 px-4 md:px-8 border-b-2 border-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-shorelines mb-6">
            Join the Team
          </h1>
          <p className="text-xl md:text-2xl font-light">
            We're building something special and we need great people to help us do it.
          </p>
        </div>
      </AnimatedSection>

      {/* Content */}
      <section className="py-24 px-4 md:px-8 overflow-hidden">
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