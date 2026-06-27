"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO =
  "https://vibe.filesafe.space/1782359074813107391/attachments/7e2aeccd-b174-447b-90d6-578c90242df0.png";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary overflow-hidden"
        >
          <div
            className="absolute top-1/2 left-0 w-[200%] md:w-full h-64 -translate-y-1/2 opacity-20 pointer-events-none"
            style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
          >
            <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <path
                id="loadingWavePath"
                d="M 0 150 Q 250 50 500 150 T 1000 150 T 1500 150 T 2000 150"
                fill="transparent"
                stroke="transparent"
              />
              <text
                className="font-sans text-5xl md:text-8xl font-black uppercase tracking-widest text-primary-foreground"
                fill="currentColor"
              >
                <textPath href="#loadingWavePath" startOffset="0%">
                  CROISSANTS ★ CROISSANTS ★ CROISSANTS ★ CROISSANTS ★
                  <animate attributeName="startOffset" from="0%" to="-50%" begin="0s" dur="10s" repeatCount="indefinite" />
                </textPath>
              </text>
            </svg>
          </div>

          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={LOGO}
            alt="Euro Patisserie Logo"
            className="w-48 md:w-64 relative z-10 filter brightness-0 invert"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
