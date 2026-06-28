import { Star } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const REVIEWS = [
  {
    quote: "Best croissants in Melbourne — flaky, buttery perfection. We come every single weekend.",
    name: "Sarah M.",
    detail: "Regular",
  },
  {
    quote: "Ordered a birthday cake and it was stunning AND delicious. The whole family was blown away.",
    name: "James T.",
    detail: "Birthday cake",
  },
  {
    quote: "Their catering platters made our office event. Fresh, beautiful, and gone in minutes!",
    name: "Priya K.",
    detail: "Office catering",
  },
  {
    quote: "A proper European patisserie right here in Armadale. The macarons are absolutely incredible.",
    name: "Daniel R.",
    detail: "Local",
  },
];

export function Testimonials() {
  return (
    <section className="border-y-2 border-primary bg-secondary px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center">
          <p className="text-xs font-faro uppercase tracking-[0.3em] text-primary/60">Loved locally</p>
          <h2 className="mt-2 font-shorelines text-5xl leading-none md:text-7xl">Kind Words</h2>
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <AnimatedSection
              key={r.name}
              delay={i * 0.08}
              className="flex flex-col justify-between border-2 border-primary bg-background p-7"
            >
              <div>
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 font-serif text-lg leading-relaxed md:text-xl">&ldquo;{r.quote}&rdquo;</p>
              </div>
              <div className="mt-6 border-t-2 border-border pt-3">
                <p className="text-sm font-bold uppercase tracking-[0.12em]">{r.name}</p>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{r.detail}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
