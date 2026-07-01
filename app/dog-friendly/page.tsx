import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Dog Friendly — Euro Patisserie Armadale",
  description:
    "We're dog friendly! Bring your best companion along and relax in our outdoor seating area in Armadale.",
  alternates: { canonical: "/dog-friendly" },
};

const DOG_IMG =
  "https://vibe.filesafe.space/1782359074813107391/attachments/17124f1b-7f7c-4903-94c7-7d24968b1d60.png";
const OUTDOOR_IMG =
  "https://vibe.filesafe.space/1782359074813107391/attachments/982a14ae-934a-417e-828f-386be0dadded.png";

export default function DogFriendlyPage() {
  return (
    <div className="flex w-full flex-col bg-background">
      {/* Hero: intro + dog photo */}
      <section className="flex w-full flex-col border-b-2 border-primary md:flex-row">
        <div className="flex w-full flex-col items-center justify-center border-b-2 border-primary bg-primary p-8 text-center text-primary-foreground md:w-1/2 md:border-b-0 md:border-r-2 md:p-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary-foreground/60">
            Bring your bestie
          </p>
          <h1 className="mb-6 font-shorelines text-6xl leading-none md:text-8xl">Dog Friendly</h1>
          <p className="max-w-md text-lg font-light md:text-xl">
            Bring your furry friends along! Enjoy our outdoor seating with your best companion by
            your side.
          </p>
        </div>
        <div className="aspect-square w-full md:aspect-auto md:min-h-[70vh] md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DOG_IMG}
            alt="A happy dog at the dog-friendly Euro Patisserie café"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* Our outdoor area */}
      <section className="flex w-full flex-col border-b-2 border-primary md:flex-row-reverse">
        <div className="flex w-full flex-col justify-center border-b-2 border-primary bg-background p-8 md:w-1/2 md:border-b-0 md:border-l-2 md:p-16">
          <AnimatedSection>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Our Outdoor Area
            </p>
            <h2 className="mb-6 font-shorelines text-4xl leading-none md:text-6xl">Relax outside</h2>
            <p className="max-w-md text-lg font-light text-muted-foreground">
              Pull up a chair on our Armadale terrace — coffee in hand and your pup by your side.
              Water bowls and a warm welcome are always on the house.
            </p>
            <Button
              asChild
              className="mt-8 w-fit rounded-none border-2 border-primary bg-primary px-8 py-6 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-transparent hover:text-primary hover:shadow-[4px_4px_0_0_hsl(var(--primary))]"
            >
              <Link href="/contact">Find Us</Link>
            </Button>
          </AnimatedSection>
        </div>
        <div className="aspect-square w-full md:aspect-auto md:min-h-[70vh] md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={OUTDOOR_IMG}
            alt="Euro Patisserie outdoor seating area in Armadale"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
