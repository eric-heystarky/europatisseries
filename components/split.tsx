import { AnimatedSection } from "./AnimatedSection";

/** Photo beside a block of copy — the main rhythm of the content pages. `flip` puts the photo on the right. */
export function Split({
  img,
  alt,
  eyebrow,
  title,
  flip = false,
  tint = false,
  children,
}: {
  img: string;
  alt: string;
  eyebrow: string;
  title: string;
  flip?: boolean;
  tint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"} ${tint ? "bg-euro-tint" : "bg-white"}`}>
      <div className="relative min-h-[360px] w-full md:min-h-[620px] md:w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <AnimatedSection className="flex w-full flex-col justify-center gap-5 px-6 py-16 md:w-1/2 md:px-16 lg:px-24">
        <p className="euro-eyebrow text-euro-muted">{eyebrow}</p>
        <h2 className="euro-heading text-[clamp(26px,2.6vw,38px)] text-euro-ink">{title}</h2>
        <div className="flex max-w-[520px] flex-col gap-4 text-[15px] leading-[1.8] text-euro-soft">{children}</div>
      </AnimatedSection>
    </section>
  );
}

/** A short list inside a Split — a thin dash before each point, no boxes. */
export function Points({ items }: { items: string[] }) {
  return (
    <ul className="mt-1 flex flex-col gap-2">
      {items.map((p) => (
        <li key={p} className="flex items-baseline gap-3 text-[14px] text-euro-text">
          <span aria-hidden="true" className="h-px w-3 flex-none translate-y-[-4px] bg-euro-muted" />
          {p}
        </li>
      ))}
    </ul>
  );
}

/** Full-bleed photo hero with a navy wash and centred light caps. */
export function PhotoHero({
  img,
  alt,
  eyebrow,
  title,
  children,
}: {
  img: string;
  alt: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative flex h-[62svh] min-h-[440px] flex-col items-center justify-center overflow-hidden text-center text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(5,9,48,0.42)]" />
      <div className="relative flex flex-col items-center gap-4 px-6">
        <p className="euro-eyebrow">{eyebrow}</p>
        <h1 className="euro-heading mr-[-0.2em] text-[clamp(34px,4.4vw,60px)] tracking-[0.2em]">{title}</h1>
        {children}
      </div>
    </section>
  );
}

/** White (filled) and outline buttons for use on a photo — equal width when stacked on phones. */
export const BTN_ON_PHOTO =
  "flex h-[46px] w-full max-w-[260px] items-center justify-center bg-white px-[34px] sm:w-auto text-[11px] font-medium uppercase tracking-[0.2em] text-euro-ink transition-opacity hover:opacity-90";
export const BTN_ON_PHOTO_OUTLINE =
  "flex h-[46px] w-full max-w-[260px] items-center justify-center border border-white px-[34px] sm:w-auto text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-euro-ink";
