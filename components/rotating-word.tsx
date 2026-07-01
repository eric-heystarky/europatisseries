"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Cycles through a list of words in place, fading/blurring each one out before
 * the next reappears — a premium "disappear and reappear" effect.
 *
 * An invisible sizer reserves the width of the longest word so the text BEFORE
 * this component never shifts as the words flip. Respects prefers-reduced-motion.
 */
export function RotatingWord({
  words,
  intervalMs = 2400,
  className = "",
}: {
  words: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(t);
  }, [words.length, intervalMs]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");

  const variants = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: "0.45em", filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: "-0.45em", filter: "blur(8px)" },
      };

  return (
    <span className={`relative inline-block whitespace-nowrap align-bottom ${className}`}>
      {/* Invisible sizer: keeps the slot at the widest word so "Exceptional" stays put. */}
      <span className="invisible" aria-hidden>
        {longest}
      </span>
      {/* Overlay is centred within the slot — so the word stays centred on its own line on mobile. */}
      <span className="absolute inset-x-0 top-0 text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
