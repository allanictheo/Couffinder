import { TankardLogo } from "./art";

/**
 * Carte de chargement : invisible pendant 0,6 s (pas de clignotement si l'API
 * répond vite), puis une astuce façon écran de chargement de jeu.
 */
export function LoadingCard({ query, tip }: { query: string; tip: string }) {
  return (
    <div className="late-fade-in card-neutral flex items-center gap-4 p-5" role="status">
      <TankardLogo className="size-10 shrink-0 animate-bounce motion-reduce:animate-none" />
      <div className="min-w-0">
        <p className="truncate font-semibold">Délibération sur « {query} »...</p>
        <p className="mt-1 text-sm text-brume">{tip}</p>
      </div>
    </div>
  );
}
