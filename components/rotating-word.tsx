"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Cycles through a list of words in place, animated per character (like an
 * After Effects text animator): letters rise in one after another from a soft
 * blur, hold, then lift out the same way before the next word arrives.
 *
 * An invisible sizer reserves the width of the longest word so the text BEFORE
 * this component never shifts as the words flip. Respects prefers-reduced-motion.
 */
const STAGGER = 0.035; // seconds between letters

const word: Variants = {
  in: { transition: { staggerChildren: STAGGER } },
  out: { transition: { staggerChildren: STAGGER * 0.6 } },
};

const letter: Variants = {
  from: { opacity: 0, y: "0.6em", rotate: 6, filter: "blur(6px)" },
  in: {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  out: {
    opacity: 0,
    y: "-0.45em",
    filter: "blur(4px)",
    transition: { duration: 0.32, ease: [0.55, 0, 1, 0.45] },
  },
};

export function RotatingWord({
  words,
  intervalMs = 2400,
  className = "",
  align = "center",
}: {
  words: string[];
  intervalMs?: number;
  className?: string;
  align?: "center" | "left";
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(t);
  }, [words.length, intervalMs]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");
  const current = words[index];

  return (
    <span className={`relative inline-block whitespace-nowrap align-bottom ${className}`}>
      {/* Invisible sizer: keeps the slot at the widest word so "Exceptional" stays put. */}
      <span className="invisible" aria-hidden>
        {longest}
      </span>
      <span className={`absolute inset-x-0 top-0 ${align === "left" ? "text-left" : "text-center"}`}>
        <span className="sr-only">{current}</span>
        <AnimatePresence mode="wait" initial={false}>
          {reduce ? (
            <motion.span
              key={current}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-block"
            >
              {current}
            </motion.span>
          ) : (
            <motion.span key={current} aria-hidden variants={word} initial="from" animate="in" exit="out" className="inline-block">
              {Array.from(current).map((ch, i) => (
                <motion.span key={i} variants={letter} className="inline-block origin-bottom-left">
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </span>
  );
}
