"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { PLACEHOLDER_EXAMPLES } from "@/lib/client/copy";

/** Exemples qui défilent façon machine à sous dans le champ vide (décoratif). */
export function RotatingPlaceholder() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center overflow-hidden whitespace-nowrap pl-5 pr-2 text-brume/70 @xl:pl-6"
    >
      <span className="mr-[0.3em]">Genre</span>
      <span className="relative inline-flex min-w-0 flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={index}
            className="block truncate text-parchemin/55"
            initial={{ y: "70%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-70%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            « {PLACEHOLDER_EXAMPLES[index]} »
          </m.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
