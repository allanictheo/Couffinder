import type { EggLevel, VieLevel } from "./catalog";

/** Ce que reçoit chaque animation de tribu. */
export interface EggProps {
  word: string;
  score: number;
  /** Graine du hasard : même graine, même chaos (rendu pur). */
  seed: number;
  level: EggLevel;
  variant: string;
  durationMs: number;
  onDone: () => void;
}

/** Ce que reçoit chaque animation de la famille « Vie normale » (tranche de score au lieu du niveau). */
export interface VieProps extends Omit<EggProps, "level"> {
  level: VieLevel;
}
