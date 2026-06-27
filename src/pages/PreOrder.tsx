import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useSquareCatalog, type Product } from "@/hooks/useSquareCatalog";

export default function PreOrder() {
  const { data: products = [], isLoading } = useSquareCatalog();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-32">
        <p className="text-3xl font-shorelines animate-pulse text-primary">Loading Menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSection className="border-b-2 border-primary bg-primary text-primary-foreground py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-shorelines leading-none mb-4 md:mb-6 mt-8 md:mt-0">
            Pre-Order
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-xl">
            Skip the queue. Order online at least 24 hours in advance and pick up your sweet treats from our café.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-5xl mx-auto py-12 md:py-16 px-4 md:px-8 space-y-16 md:space-y-24">
        {/* Pastries Category */}
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-shorelines border-b-4 border-primary pb-2 md:pb-4 mb-8 md:mb-12">
            Pastries & Cakes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.filter(p => p.category === 'pastries').map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </AnimatedSection>

        {/* Catering Category */}
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-shorelines border-b-4 border-primary pb-2 md:pb-4 mb-8 md:mb-12">
            Catering Packs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.filter(p => p.category === 'catering').map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border-2 border-primary bg-card flex flex-col group hover:-translate-y-1 transition-transform duration-300">
      <div className="aspect-square border-b-2 border-primary overflow-hidden bg-secondary">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <div className="flex flex-col mb-2 md:mb-4 gap-2">
          <h3 className="text-2xl font-shorelines leading-tight">{product.name}</h3>
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-4 md:mb-6 flex-1">{product.description}</p>
        <Button
          onClick={() => toast.success(`${product.name} added to cart`)}
          className="w-full rounded-none border-2 border-primary bg-primary text-primary-foreground hover:bg-background hover:text-primary hover:-translate-y-1 hover:shadow-[4px_4px_0_0_hsl(var(--primary))] uppercase tracking-widest font-bold transition-all duration-300"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}