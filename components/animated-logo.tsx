"use client";

import { useId } from "react";
import { DOT_PATHS, LOGO_VIEWBOX, SCRIPT_PATH, WORD_PATHS } from "./logo-paths";

/**
 * The brand logo with "patisserie" handwritten in, left to right — a soft pen
 * edge sweeps across the script (and its i-dots) as if it's being written.
 * "euro" sits still underneath. Uses currentColor; set it with a text-* class.
 */
export function AnimatedLogo({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label="Euro Patisserie" className={className}>
      <defs>
        <linearGradient id={`${id}-pen`}>
          <stop offset="0.92" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-write`} maskUnits="userSpaceOnUse" x="0" y="0" width="590" height="130">
          {/* The script spans x≈119–481; the pen edge travels across it. */}
          <rect className="logo-pen" x="-480" y="0" width="600" height="130" fill={`url(#${id}-pen)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-write)`} fill="currentColor">
        <path d={SCRIPT_PATH} />
        {DOT_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="currentColor">
        {WORD_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
