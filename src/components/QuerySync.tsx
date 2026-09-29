"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Lit `?q=` dans l'URL et prévient l'application quand il change
 * (chargement initial, bouton précédent/suivant, lien partagé).
 *
 * Isolé dans son propre composant, sous un <Suspense>, pour que seul lui
 * bascule en rendu client : tout le reste de la page reste prérendu.
 */
export function QuerySync({ onQuery }: { onQuery: (query: string | null) => void }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    onQuery(query);
  }, [query, onQuery]);

  return null;
}
