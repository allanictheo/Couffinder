/**
 * Petites icônes de tribu (orbe du succès, page de prévisualisation).
 * Dessins originaux, aucun logo : manette pixel, chapeau pointu, cornes,
 * chope, fleur de cerisier, d20.
 */

import type { SVGProps } from "react";
import type { Tribe } from "@/lib/types";
import { PixelArt, TankardLogo } from "../art";

const PAD_ROWS = [
  "..............",
  "..kkkkkkkkkk..",
  ".kwwwwwwwwwwk.",
  "kwwkwwwwwwrwwk",
  "kwkkkwwwwrwrwk",
  "kwwkwwwwwwrwwk",
  "kwwwwkkkkwwwwk",
  ".kwwk....kwwk.",
  "..kk......kk..",
] as const;

export function PixelPad(props: SVGProps<SVGSVGElement>) {
  return <PixelArt rows={PAD_ROWS} palette={{ k: "#111", w: "#e8e8e8", r: "#e3202f" }} {...props} />;
}

export function WizardHat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 2.5 L17.5 17 H6.5 Z" fill="#3b2a6b" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" />
      <path d="M13.5 5.5 C16 6.5 17 8 18.5 7" fill="none" stroke="#111" strokeWidth={1.2} strokeLinecap="round" />
      <ellipse cx="12" cy="18" rx="10" ry="3" fill="#2a1d4f" stroke="#111" strokeWidth={1.2} />
      <path d="M11.6 9.2 l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2z" fill="#ffc84a" />
    </svg>
  );
}

/** Main qui fait les cornes, version pictogramme. */
export function HornsHand(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g fill="#f2d2b0" stroke="#111" strokeWidth={1.1} strokeLinejoin="round">
        <rect x="6.2" y="2.5" width="3.2" height="11" rx="1.6" />
        <rect x="15.2" y="3.5" width="3.2" height="10" rx="1.6" />
        <path d="M5.5 11.5 h13.5 v5.5 a5 5 0 0 1 -5 5 h-3.5 a5 5 0 0 1 -5 -5 z" />
        <path d="M9.4 12 c0-2 5.6-2 5.6 0" fill="none" />
        <path d="M5.8 14.5 c-2.2-.6-3.2-2.5-2-3.6 1-.8 2.5 0 3.2 1.2" />
      </g>
    </svg>
  );
}

export function SakuraFlower(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-12 -12 24 24" aria-hidden="true" {...props}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M0 -1 C-4 -4 -4.5 -8.5 -1.4 -10.6 L0 -9 L1.4 -10.6 C4.5 -8.5 4 -4 0 -1 Z"
          fill="#ffb3d6"
          stroke="#c2185b"
          strokeWidth={0.7}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="2.1" fill="#ffd54a" stroke="#c2185b" strokeWidth={0.6} />
    </svg>
  );
}

/** D20 vu de face : hexagone et facettes. */
export function FlatD20({ value, ...props }: { value?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 1.5 L21.5 7 V17 L12 22.5 L2.5 17 V7 Z" fill="#c62a3a" stroke="#111" strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M12 6 L17.8 15.5 H6.2 Z" fill="#e2485a" stroke="#111" strokeWidth={0.8} strokeLinejoin="round" />
      <path d="M12 1.5 L12 6 M21.5 7 L17.8 15.5 M2.5 7 L6.2 15.5 M12 22.5 L6.2 15.5 M12 22.5 L17.8 15.5 M2.5 7 L12 6 L21.5 7 M2.5 17 L6.2 15.5 M21.5 17 L17.8 15.5" stroke="#111" strokeWidth={0.8} fill="none" />
      <text x="12" y="13.9" textAnchor="middle" fontSize="5.6" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#fff">
        {value ?? 20}
      </text>
    </svg>
  );
}

export function TribeIcon({ tribe, className }: { tribe: Tribe; className?: string }) {
  switch (tribe) {
    case "gamer":
      return <PixelPad className={className} />;
    case "geek":
      return <WizardHat className={className} />;
    case "metal":
      return <HornsHand className={className} />;
    case "taverne":
      return <TankardLogo className={className} />;
    case "weeb":
      return <SakuraFlower className={className} />;
    case "roliste":
      return <FlatD20 className={className} />;
  }
}
