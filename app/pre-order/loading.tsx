import { Skeleton } from "@/components/ui/skeleton";

// Shown while the live menu is fetched from Square (force-dynamic route).
export default function PreOrderLoading() {
  return (
    <>
      {/* Hero (static, shows instantly) */}
      <section className="border-b-2 border-border bg-primary px-5 py-20 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/60">Les Collections</p>
        <h1 className="font-display text-7xl leading-none md:text-8xl">pre-order</h1>
        <p className="mx-auto mt-4 max-w-md text-sm uppercase tracking-[0.15em] text-primary-foreground/70">
          Premium European pastries &amp; catering, made in Armadale. Pickup or delivery.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16">
        <Skeleton className="h-9 w-64 rounded-none" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col border-2 border-border bg-card">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-2/3 rounded-none" />
                <Skeleton className="h-4 w-full rounded-none" />
                <Skeleton className="mt-2 h-10 w-full rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
