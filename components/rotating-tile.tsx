"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMenuImages } from "@/lib/use-menu-images";

/**
 * Fills a bento tile with a menu photo that alternates over time. `seed` offsets
 * the starting photo so neighbouring tiles show different items.
 */
export function RotatingTileImage({
  alt,
  seed = 0,
  intervalMs = 3000,
}: {
  alt: string;
  seed?: number;
  intervalMs?: number;
}) {
  const images = useMenuImages();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setStep((s) => s + 1), intervalMs);
    return () => clearInterval(t);
  }, [images, intervalMs]);

  if (!images.length) return <div className="absolute inset-0 bg-primary/10" />;

  const idx = (step + seed) % images.length;
  return (
    <AnimatePresence mode="popLayout">
      <motion.img
        key={idx}
        src={images[idx]}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </AnimatePresence>
  );
}
