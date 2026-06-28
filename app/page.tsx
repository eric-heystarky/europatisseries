"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useRef, useState, useEffect } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { RotatingTileImage } from "@/components/rotating-tile";

const heroCategories = [
  { name: "Artisan Cakes", image: "https://vibe.filesafe.space/1782359074813107391/attachments/10a71050-16bc-405f-af35-634769e62040.jpg", link: "/pre-order" },
  { name: "Le Croissant au Beurre", image: "https://vibe.filesafe.space/1782359074813107391/attachments/892503fb-424e-4d41-9419-88f00f047ebb.png", link: "/pre-order" },
  { name: "Eclairs", image: "https://vibe.filesafe.space/1782359074813107391/attachments/dbaf613c-3e6b-45e0-af7a-e278e2d1a6df.png", link: "/pre-order" },
  { name: "Focaccia", image: "https://vibe.filesafe.space/1782359074813107391/assets/520e8b0a-5e74-40ed-9fdf-65565b107cb7.png", link: "/pre-order" },
  { name: "Grab & Go", image: "https://vibe.filesafe.space/1782359074813107391/attachments/eb7ec6d8-d4e7-4f17-af17-289e293329b4.png", link: "/pre-order" },
];

const mobileTiles = [
  { title: "WEDDING CAKES", link: "/pre-order" },
  { title: "LARGE ENTREMETS", link: "/catering" },
  { title: "SWEET COCKTAIL PIECES", link: "/contact" },
  { title: "SAVORY COCKTAIL PIECES", link: "/pre-order" },
];

const desktopTiles = [
  { title: "PIÈCE MONTÉE", link: "/pre-order", span: "col-span-2", aspect: "aspect-[4/3]" },
  { title: "GRAND ENTREMETS", link: "/catering", span: "col-span-1", aspect: "aspect-[3/4]" },
  { title: "PIÈCES COCKTAILS SUCRÉES", link: "/contact", span: "col-span-1", aspect: "aspect-[3/4]" },
  { title: "PIÈCES COCKTAILS SALÉES", link: "/pre-order", span: "col-span-2", aspect: "aspect-[4/3]" },
  { title: "ECLAIRS", link: "/pre-order", span: "col-span-1", aspect: "aspect-[3/4]" },
  { title: "GRAB & GO", link: "/pre-order", span: "col-span-1", aspect: "aspect-[3/4]" },
  { title: "BUFFET", link: "/catering", span: "col-span-2", aspect: "aspect-[4/3]" },
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

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroCategories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <h1 className="sr-only">
        Euro Patisserie Armadale — European pastries, cakes &amp; catering
      </h1>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100vh] md:min-h-[85vh] w-full border-b-2 border-primary overflow-hidden flex items-center bg-primary">
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

      {/* Marquee */}
      <div className="border-b-2 border-primary overflow-hidden py-8 md:py-12 bg-primary text-primary-foreground flex items-center justify-center min-h-[180px] md:min-h-[250px]">
        <div
          className="w-[200%] md:w-full"
          style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
        >
          <svg width="100%" height="250" viewBox="0 0 1000 300" preserveAspectRatio="none" className="h-[180px] md:h-[250px]">
            <path id="mainWavePath" d="M 0 150 Q 250 50 500 150 T 1000 150 T 1500 150 T 2000 150" fill="transparent" stroke="transparent" />
            <text className="font-sans text-5xl md:text-8xl font-black uppercase tracking-widest" fill="currentColor">
              <textPath href="#mainWavePath" startOffset="0%">
                CROISSANTS ★ CROISSANTS ★ CROISSANTS ★ CROISSANTS ★ CROISSANTS ★ CROISSANTS ★
                <animate attributeName="startOffset" from="0%" to="-50%" begin="0s" dur="15s" repeatCount="indefinite" />
              </textPath>
            </text>
          </svg>
        </div>
      </div>

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
                        <RotatingTileImage alt={item.title} seed={i} intervalMs={1000} />
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
                      <RotatingTileImage alt={item.title} seed={i} intervalMs={1000} />
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

      {/* Join the Team Section */}
      <section className="relative py-16 md:py-32 px-4 md:px-8 bg-primary text-primary-foreground overflow-hidden">
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium uppercase tracking-tight leading-tight mb-6 md:mb-8">
              Interested in joining<br/>Euro Patisserie?
            </h2>
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
              <Link href="/join-team">Apply Here</Link>
            </Button>
          </div>
        </AnimatedSection>
      </section>

      {/* Dog Friendly Section */}
      <section className="w-full flex flex-col md:flex-row border-t-2 border-primary">
        <div className="w-full md:w-1/2 bg-background flex flex-col justify-center items-center text-center p-8 md:p-16 border-b-2 md:border-b-0 md:border-r-2 border-primary">
          <AnimatedSection>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-shorelines leading-none mb-6">
              Dog Friendly
            </h2>
            <p className="text-lg md:text-xl font-medium max-w-md mx-auto">
              Bring your furry friends along! Enjoy our outdoor seating with your best companion by your side.
            </p>
          </AnimatedSection>
        </div>
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[60vh]">
          <img
            src="https://vibe.filesafe.space/1782359074813107391/attachments/17124f1b-7f7c-4903-94c7-7d24968b1d60.png"
            alt="Dog Friendly Cafe"
            className="w-full h-full object-cover transition-all duration-700"
          />
        </div>
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
