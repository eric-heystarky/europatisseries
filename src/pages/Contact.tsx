import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/AnimatedSection";
import { submitLeadForm } from "@/lib/submitForm";

const INITIAL_FORM = { name: "", email: "", message: "" };

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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left side info */}
      <AnimatedSection className="w-full md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-primary bg-secondary p-8 md:p-16 flex flex-col justify-center">
        <h1 className="text-7xl md:text-9xl font-shorelines leading-none mb-12">
          Get In<br/>Touch
        </h1>

        <div className="space-y-12">
          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4 border-b-2 border-primary pb-2 inline-block">Visit Us</h3>
            <p className="text-3xl font-shorelines">
              974 High St<br/>
              Armadale VIC 3143
            </p>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4 border-b-2 border-primary pb-2 inline-block">Hours</h3>
            <p className="text-2xl font-shorelines">
              Tues - Sun: 7am - 2pm<br/>
              Mon: Closed
            </p>
          </div>

          <div>
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4 border-b-2 border-primary pb-2 inline-block">Contact</h3>
            <p className="text-2xl font-shorelines">
              hello@europatisserie.com<br/>
              (03) 9822 1234
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Right side form */}
      <AnimatedSection className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-background" delay={0.2}>
        <h2 className="text-5xl font-shorelines mb-8">
          Send a message
        </h2>

        <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="contact-name" className="font-bold uppercase tracking-widest text-xs">Name</label>
            <Input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange("name")}
              required
              autoComplete="name"
              className="rounded-none border-2 border-primary h-12 bg-card focus-visible:ring-0 focus-visible:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className="font-bold uppercase tracking-widest text-xs">Email</label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              autoComplete="email"
              className="rounded-none border-2 border-primary h-12 bg-card focus-visible:ring-0 focus-visible:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-message" className="font-bold uppercase tracking-widest text-xs">Message</label>
            <Textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={handleChange("message")}
              required
              className="rounded-none border-2 border-primary min-h-[150px] bg-card focus-visible:ring-0 focus-visible:border-primary/50 resize-none"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full rounded-none border-2 border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--primary))] uppercase tracking-widest font-bold py-8 text-lg transition-all duration-300 disabled:opacity-60">
            {isSubmitting ? "Sending..." : "Submit"}
          </Button>
        </form>
      </AnimatedSection>
    </div>
  );
}
