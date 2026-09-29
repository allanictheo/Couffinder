/**
 * Illustrations maison, en SVG : aucun asset externe, aucun logo de marque.
 * Clins d'œil génériques aux codes 2010-2015 (lunettes pixel, hitmarker, chips, canette).
 */

import { useId, type ReactElement, type SVGProps } from "react";

type PixelPalette = Record<string, string>;

/** Rend une grille de caractères en pixels SVG nets (1 caractère = 1 pixel). */
export function PixelArt({
  rows,
  palette,
  title,
  ...props
}: { rows: readonly string[]; palette: PixelPalette; title?: string } & SVGProps<SVGSVGElement>) {
  const width = Math.max(...rows.map((row) => row.length));
  const rects: ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      const fill = palette[char];
      if (!fill) {
        x += 1;
        continue;
      }
      // Fusionne les pixels identiques consécutifs : moins de nœuds DOM.
      let run = 1;
      while (x + run < row.length && row[x + run] === char) run += 1;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={fill} />);
      x += run;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${width} ${rows.length}`}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {rects}
    </svg>
  );
}

export const TANKARD_ROWS = [
  "................",
  "...ww..www......",
  "..wwwwwwwwww....",
  "..wwwwwwwwww....",
  "..aaaaaaaaaa....",
  "..aaaaaaaaaahhh.",
  "kkkkkkkkkkkkk.h.",
  ".kwwkkaakwwkk.h.",
  "..kkkaaaakkk..h.",
  "..aaaaaaaaaahhh.",
  "..adaaaadaaa....",
  "..adaaaadaaa....",
  "..adaaaadaaa....",
  "..aaaaaaaaaa....",
  "..dddddddddd....",
  "................",
] as const;

export const TANKARD_PALETTE: PixelPalette = {
  w: "#fff4dc",
  a: "#ffb627",
  d: "#c97800",
  h: "#c97800",
  k: "#0b0710",
};

/** Le logo : une chope d'hydromel qui porte des lunettes pixel. Chouffin et MLG à la fois. */
export function TankardLogo(props: SVGProps<SVGSVGElement>) {
  return <PixelArt rows={TANKARD_ROWS} palette={TANKARD_PALETTE} {...props} />;
}

export const GLASSES_ROWS = [
  "KKKKKKKKKKKKKKKKKKKKKKKK",
  ".KKWWKKKKKK..KKWWKKKKKK.",
  ".KWWKKKKKKK..KWWKKKKKKK.",
  "..KKKKKKKK....KKKKKKKK..",
  "...KKKKKK......KKKKKK...",
] as const;

export function PixelGlasses(props: SVGProps<SVGSVGElement>) {
  return <PixelArt rows={GLASSES_ROWS} palette={{ K: "#050505", W: "#ffffff" }} {...props} />;
}

export function Hitmarker(props: SVGProps<SVGSVGElement>) {
  const lines = (
    <>
      <path d="M6 6 L14 14" />
      <path d="M30 6 L22 14" />
      <path d="M6 30 L14 22" />
      <path d="M30 30 L22 22" />
    </>
  );
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" {...props}>
      <g stroke="#000" strokeWidth={5.5} strokeLinecap="square">
        {lines}
      </g>
      <g stroke="#fff" strokeWidth={2.6} strokeLinecap="square">
        {lines}
      </g>
    </svg>
  );
}

/** Chips triangulaire générique, saupoudrée. */
export function Chip(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 60" aria-hidden="true" {...props}>
      <path
        d="M32 4 C35 4 37 6 38.5 8.5 L60 49 C62 53 59.5 57 55 57 L9 57 C4.5 57 2 53 4 49 L25.5 8.5 C27 6 29 4 32 4 Z"
        fill="#ff9c2a"
        stroke="#7a2f00"
        strokeWidth={2.5}
      />
      <path d="M31 12 L12 49" stroke="#ffd27a" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <g fill="#d9480f">
        <circle cx="30" cy="30" r="2" />
        <circle cx="40" cy="42" r="2.4" />
        <circle cx="22" cy="46" r="1.8" />
        <circle cx="35" cy="21" r="1.4" />
        <circle cx="46" cy="50" r="1.6" />
        <circle cx="28" cy="40" r="1.2" />
      </g>
    </svg>
  );
}

/** Canette de soda fluo sans marque. */
export function SodaCan(props: SVGProps<SVGSVGElement>) {
  const id = useId();
  const body = `${id}-body`;
  const metal = `${id}-metal`;
  return (
    <svg viewBox="0 0 40 72" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={body} x1="0" x2="1">
          <stop offset="0" stopColor="#5f9f00" />
          <stop offset="0.35" stopColor="#d6ff6a" />
          <stop offset="0.6" stopColor="#b6ff2e" />
          <stop offset="1" stopColor="#4f8a00" />
        </linearGradient>
        <linearGradient id={metal} x1="0" x2="1">
          <stop offset="0" stopColor="#8a8a8a" />
          <stop offset="0.4" stopColor="#f2f2f2" />
          <stop offset="1" stopColor="#7a7a7a" />
        </linearGradient>
      </defs>
      <rect x="3" y="6" width="34" height="60" rx="6" fill={`url(#${body})`} stroke="#1d3300" strokeWidth={2} />
      <rect x="5" y="2" width="30" height="8" rx="4" fill={`url(#${metal})`} stroke="#333" strokeWidth={1.5} />
      <rect x="5" y="62" width="30" height="8" rx="4" fill={`url(#${metal})`} stroke="#333" strokeWidth={1.5} />
      <rect x="3" y="24" width="34" height="22" fill="#0e0a16" opacity={0.85} />
      <text x="20" y="40" textAnchor="middle" fontFamily="Impact, 'Arial Narrow', sans-serif" fontSize="13" fill="#b6ff2e">
        FLUO
      </text>
    </svg>
  );
}

export function Trophy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.4A5 5 0 0 1 13 14.9V17h3v3H8v-3h3v-2.1A5 5 0 0 1 8.4 12H8a4 4 0 0 1-4-4V5h3V3Zm0 4H6v1a2 2 0 0 0 1 1.7V7Zm10 0v2.7A2 2 0 0 0 18 8V7h-1Z" />
    </svg>
  );
}

export function SpeakerIcon({ muted, ...props }: { muted: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 9l5 5M21 9l-5 5" />
      ) : (
        <>
          <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
          <path d="M18.5 7a7 7 0 0 1 0 10" />
        </>
      )}
    </svg>
  );
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M12 3v12M7 8l5-5 5 5" />
      <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Deux flèches qui se croisent : verdict renversé. */
export function FlipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 7h13l-3-3M20 17H7l3 3" />
    </svg>
  );
}

/** Bulle de forum : mot adopté par la communauté. */
export function CommunityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M9 10.5h6M12 7.5v6" />
    </svg>
  );
}

export function RedCard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 64" aria-hidden="true" {...props}>
      <rect x="4" y="4" width="40" height="56" rx="5" fill="#e3202f" stroke="#5c0008" strokeWidth={2.5} />
      <rect x="9" y="9" width="12" height="28" rx="3" fill="#fff" opacity={0.25} />
    </svg>
  );
}

export function Tumbleweed(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="#b58a4c" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true" {...props}>
      <circle cx="32" cy="32" r="26" stroke="#8a6532" />
      <path d="M10 26c12-6 30 10 44-2M12 42c10-14 26-4 40-18M20 12c2 16 18 28 16 46M44 10c-8 14 4 30-12 46M8 34c16 4 24 16 48 4" />
      <path d="M18 20c10 2 22 6 30 18M16 48c8-8 20-8 32-4" stroke="#6f4f24" />
    </svg>
  );
}
