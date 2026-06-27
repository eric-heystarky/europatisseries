"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Catering() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Hero */}
      <AnimatedSection className="bg-primary text-primary-foreground py-24 px-4 md:px-8 border-b-2 border-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-shorelines mb-6">
            Catering
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto">
            Elevate your next event with our premium assortment of miniature pastries, cakes, and savories.
          </p>
        </div>
      </AnimatedSection>

      {/* Content */}
      <section className="py-24 px-4 md:px-8 overflow-hidden">
        <AnimatedSection className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-shorelines mb-8">
              Perfect for Any Occasion
            </h2>
            <div className="space-y-6 text-lg font-medium">
              <p>
                From corporate meetings and office parties to weddings and private celebrations, our catering packages are designed to impress.
              </p>
              <p>
                We offer a curated selection of our most popular items in miniature sizes, allowing your guests to sample a variety of flavors. Custom orders and specific dietary requirements can be accommodated with advance notice.
              </p>
            </div>
            <div className="mt-10">
              <Button asChild size="lg" className="rounded-none border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--primary))] uppercase tracking-widest font-bold px-12 py-8 transition-all duration-300">
                <Link href="/contact">Enquire Now</Link>
              </Button>
            </div>
          </div>

          <div className="bg-card border-2 border-primary p-8 md:p-12">
            <h3 className="text-3xl font-shorelines mb-6">Catering Enquiry</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-xs">Name</label>
                <Input className="rounded-none border-2 border-primary h-12 bg-background focus-visible:ring-0 focus-visible:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-xs">Email</label>
                <Input type="email" className="rounded-none border-2 border-primary h-12 bg-background focus-visible:ring-0 focus-visible:border-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-xs">Event Date & Details</label>
                <Textarea className="rounded-none border-2 border-primary min-h-[120px] bg-background focus-visible:ring-0 focus-visible:border-primary/50 resize-none" />
              </div>
              <Button type="submit" className="w-full rounded-none border-2 border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--primary))] uppercase tracking-widest font-bold py-6 text-lg transition-all duration-300">
                Submit Enquiry
              </Button>
            </form>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
