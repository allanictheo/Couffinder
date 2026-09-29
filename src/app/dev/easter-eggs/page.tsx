import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EasterEggLab } from "@/components/dev/EasterEggLab";

export const metadata: Metadata = {
  title: "Labo des easter eggs",
  robots: { index: false, follow: false },
};

function first(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Page de prévisualisation des easter eggs (développement uniquement) : une grille
 * tribu × niveau × variante pour lancer chaque animation à la demande.
 *
 * Paramètres utiles (captures automatiques) : `?play=gamer.combo.killstreak`,
 * `&word=Skyrim`, `&reduced=1` (simule le mouvement réduit).
 */
export default async function EasterEggsPage({ searchParams }: PageProps<"/dev/easter-eggs">) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  return <EasterEggLab autoplay={first(params.play)} word={first(params.word)} reduced={params.reduced === "1"} />;
}
