"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useRef, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FeaturedShowcase } from "@/components/featured-showcase";
import { WhyEuro } from "@/components/why-euro";

const heroCategories = [
  { name: "Artisan Cakes", image: "/images/hero/artisan-cakes.jpg", link: "/pre-order" },
  { name: "Le Croissant au Beurre", image: "/images/hero/croissant.jpg", link: "/pre-order" },
  { name: "Eclairs", image: "/images/hero/eclairs.jpg", link: "/pre-order" },
  { name: "Focaccia", image: "/images/hero/focaccia.jpg", link: "/pre-order" },
  { name: "Grab & Go", image: "/images/hero/grab-go.jpg", link: "/pre-order" },
];

const mobileTiles = [
  { title: "WEDDING CAKES", link: "/pre-order", image: "/images/catering/piece-montee.jpg" },
  { title: "LARGE ENTREMETS", link: "/catering", image: "/images/catering/grand-entremets.jpg" },
  { title: "SWEET COCKTAIL PIECES", link: "/contact", image: "/images/catering/cocktails-sucrees.jpg" },
  { title: "SAVORY COCKTAIL PIECES", link: "/pre-order", image: "/images/catering/cocktails-salees.jpg" },
];

const desktopTiles = [
  { title: "PIÈCE MONTÉE", link: "/pre-order", span: "col-span-2", aspect: "aspect-[4/3]", image: "/images/catering/piece-montee.jpg" },
  { title: "GRAND ENTREMETS", link: "/catering", span: "col-span-1", aspect: "aspect-[3/4]", image: "/images/catering/grand-entremets.jpg" },
  { title: "PIÈCES COCKTAILS SUCRÉES", link: "/contact", span: "col-span-1", aspect: "aspect-[3/4]", image: "/images/catering/cocktails-sucrees.jpg" },
  { title: "PIÈCES COCKTAILS SALÉES", link: "/pre-order", span: "col-span-2", aspect: "aspect-[4/3]", image: "/images/catering/cocktails-salees.jpg" },
  { title: "ECLAIRS", link: "/pre-order", span: "col-span-1", aspect: "aspect-[3/4]", image: "/images/featured/eclair-over.jpg" },
  { title: "GRAB & GO", link: "/pre-order", span: "col-span-1", aspect: "aspect-[3/4]", image: "/images/catering/grab-and-go.jpg" },
  { title: "BUFFET", link: "/catering", span: "col-span-2", aspect: "aspect-[4/3]", image: "/images/catering/buffet.jpg" },
];

export default function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const discoverRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const { scrollYProgress: discoverScroll } = useScroll({
    target: discoverRef,
    offset: ["start end", "end start"]
  });
  const discoverY = useTransform(discoverScroll, [0, 1], ["-10%", "10%"]);

  // Image changes on hover over a collection name (no auto-rotation).
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  return (
    <div className="flex flex-col w-full">
      <h1 className="sr-only">
        Euro Patisserie Armadale — European pastries, cakes &amp; catering
      </h1>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen w-full border-b-2 border-primary overflow-hidden flex items-center bg-primary">
        {/* Background Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHeroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[140%] -top-[20%]">
              <img
                src={heroCategories[activeHeroIndex].image}
                alt={heroCategories[activeHeroIndex].name}
                className="w-full h-full object-cover opacity-60 md:opacity-100"
              />
              <div className="absolute inset-0 bg-primary/60 md:bg-gradient-to-r md:from-primary/90 md:via-primary/50 md:to-transparent" />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col justify-center h-full pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col max-w-2xl"
          >
            <div className="mb-12 md:mb-16">
              {/* Logo removed as requested */}
            </div>

            <p className="text-sm font-faro uppercase tracking-widest text-primary-foreground/80 mb-6">Les Collections</p>

            <div className="flex flex-col space-y-4 md:space-y-6">
              {heroCategories.map((category, index) => (
                <Link
                  key={category.name}
                  href={category.link}
                  onMouseEnter={() => setActiveHeroIndex(index)}
                  className={`text-4xl md:text-6xl lg:text-7xl font-shorelines transition-colors duration-300 w-fit flex items-center ${
                    activeHeroIndex === index
                      ? "text-primary-foreground"
                      : "text-primary-foreground/50 hover:text-primary-foreground/80"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured creations — curated items with editorial food photography */}
      <FeaturedShowcase />

      {/* Why Euro Patisserie — Australian flour + French ingredients */}
      <WhyEuro />

      {/* Featured Section - Split Screen */}
      <section ref={discoverRef} className="bg-background border-b-2 border-primary relative">
        <div className="flex flex-col md:flex-row w-full min-h-screen">
          {/* Left Sticky Side (Desktop) */}
          <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b-2 md:border-b-0 md:border-r-2 border-primary md:sticky md:top-0 md:h-screen self-start z-10">
            <motion.div style={{ y: discoverY }} className="w-full">
              <AnimatedSection>
              <p className="text-sm font-faro uppercase tracking-widest text-primary/80 mb-6">DISCOVER</p>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-faro font-light uppercase leading-tight mb-8">
                OUR CUSTOM CREATIONS FOR YOUR EVENTS
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="px-8 py-6 rounded-none text-xs font-bold tracking-widest uppercase">
                  <Link href="/catering">VIEW CATALOG</Link>
                </Button>
                <Button asChild variant="ghost" className="px-8 py-6 rounded-none text-xs font-bold tracking-widest uppercase hover:bg-transparent hover:text-primary/70">
                  <Link href="/contact">CONTACT US</Link>
                </Button>
              </div>
              </AnimatedSection>
            </motion.div>
          </div>

          {/* Right Side — bento grid of rotating menu photos */}
          <div className="w-full md:w-1/2">
            {/* Mobile Carousel View */}
            <div className="md:hidden p-4">
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-4">
                  {mobileTiles.map((item, i) => (
                    <CarouselItem key={i} className="pl-4 basis-[85%] sm:basis-[70%]">
                      <Link href={item.link} className="group block relative h-[60vh] border-2 border-primary bg-card overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                          <h3 className="font-faro text-white text-sm uppercase tracking-widest">{item.title}</h3>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Desktop Grid/List View */}
            <div className="hidden md:grid grid-cols-2">
              {desktopTiles.map((item, i) => {
                const isLeftColumnSmall = item.span === 'col-span-1' && (i === 1 || i === 4);
                return (
                  <Link key={i} href={item.link} className={`group block relative border-b-2 border-primary ${isLeftColumnSmall ? 'border-r-2' : ''} ${item.span} overflow-hidden`}>
                    <div className={item.aspect}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                        <h3 className="font-faro text-white text-xs md:text-sm font-bold uppercase tracking-widest">{item.title}</h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Image Breaker Section - Locations */}
      <section className="relative w-full h-[60vh] md:h-[80vh] border-b-2 border-primary overflow-hidden flex items-center justify-center">
        <img
          src="https://vibe.filesafe.space/1782359074813107391/attachments/982a14ae-934a-417e-828f-386be0dadded.png"
          alt="Cafe Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        <AnimatedSection className="relative z-10 flex flex-col items-center text-center text-white px-4">
          <p className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 md:mb-6">
            OUR LOCATIONS
          </p>
          <h2 className="text-5xl md:text-8xl font-sans font-light tracking-widest uppercase mb-8 md:mb-12">
            ARMADALE
          </h2>
          <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary rounded-none px-8 py-6 text-xs md:text-sm tracking-widest uppercase transition-all duration-300">
            <Link href="/contact">VIEW ADDRESS</Link>
          </Button>
        </AnimatedSection>
      </section>

      {/* Google Reviews Widget — live, full width via ReputationHub */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-primary text-primary-foreground border-t-2 border-primary overflow-hidden">
        <AnimatedSection className="w-full">
          <div className="mb-8 md:mb-12 border-b-2 border-primary-foreground/20 pb-6 md:pb-8">
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-shorelines leading-none">
              Reviews
            </h2>
          </div>
          <div className="w-full min-h-[400px]">
            {/* Desktop / tablet review widget */}
            <iframe
              className="lc_reviews_widget hidden md:block"
              src="https://reputationhub.site/reputation/widgets/review_widget/PsjVrU6emhtFrBnTcoK1"
              frameBorder="0"
              scrolling="no"
              style={{ minWidth: "100%", width: "100%" }}
            ></iframe>
            {/* Mobile review widget (compact layout) */}
            <iframe
              className="lc_reviews_widget md:hidden"
              src="https://reputationhub.site/reputation/widgets/review_widget/PsjVrU6emhtFrBnTcoK1?widgetId=6a40f001d76d9aa56f396d9e"
              frameBorder="0"
              scrolling="no"
              style={{ minWidth: "100%", width: "100%" }}
            ></iframe>
          </div>
        </AnimatedSection>
        {/* Widget enhancer: auto-resizes the iframe to fit all reviews (makes it "live"). */}
        <Script
          src="https://reputationhub.site/reputation/assets/review-widget.js"
          strategy="lazyOnload"
        />
      </section>

      {/* Instagram Widget */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-background border-t-2 border-primary overflow-hidden">
        <AnimatedSection className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 border-b-2 border-primary pb-6 md:pb-8">
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-shorelines leading-none">
              Socials
            </h2>
          </div>
          <div className="transition-all duration-300 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0_0_hsl(var(--primary))] border-2 border-transparent hover:border-primary bg-background">
            <div className="commonninja_component pid-ee1f0403-91ac-4e12-b9f6-d60465fbee01 min-h-[400px]"></div>
          </div>
        </AnimatedSection>
        {/* CommonNinja SDK — renders the Instagram feed into the div above. */}
        <Script src="https://cdn.commoninja.com/sdk/latest/commonninja.js" strategy="lazyOnload" />
      </section>
    </div>
  );
}
