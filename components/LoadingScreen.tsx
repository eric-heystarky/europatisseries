"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedLogo } from "./animated-logo";

/** Opening screen: calm navy, the logo writes itself in, then the page fades up. */
export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Long enough for the script to finish writing and "euro" to settle.
    const timer = setTimeout(() => setIsLoading(false), 1350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-euro-ink"
        >
          <AnimatedLogo className="w-56 text-white md:w-72" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
