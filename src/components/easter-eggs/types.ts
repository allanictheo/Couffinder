import type { EggLevel } from "./catalog";

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
