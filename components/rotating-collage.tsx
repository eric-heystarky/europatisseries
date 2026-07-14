"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Fills a tile with a set of centred photos that cross-fade one to the next on
 * a fixed interval — a self-rotating collage. Respects prefers-reduced-motion
 * (holds the first photo). Images are object-cover + centred so the subject
 * stays focused in the middle regardless of tile shape.
 */
export function RotatingCollage({
  images,
  alt,
  intervalMs = 1000,
}: {
  images: string[];
  alt: string;
  intervalMs?: number;
}) {
  const [i, setI] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;
    const t = setInterval(() => setI((s) => (s + 1) % images.length), intervalMs);
    return () => clearInterval(t);
  }, [images.length, intervalMs, reduceMotion]);

  if (images.length === 0) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.img
        key={i}
        src={images[i]}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </AnimatePresence>
  );
}
