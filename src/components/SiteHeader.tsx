"use client";

import Link from "next/link";
import { useSoundPreference } from "@/hooks/usePreferences";
import { SpeakerIcon, TankardLogo } from "./art";

function SoundToggle() {
  const { enabled, setEnabled } = useSoundPreference();
  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      title={enabled ? "Couper le son" : "Activer le son (airhorn inclus)"}
      className="btn-ghost inline-flex min-h-11 items-center gap-2 pl-3 pr-2 text-sm font-semibold"
    >
      <SpeakerIcon muted={!enabled} className="size-5" />
      <span>Son</span>
      <span
        aria-hidden="true"
        className={`pixel-text rounded-full px-2 py-0.5 text-[0.7rem] ${enabled ? "bg-dew text-nuit" : "bg-white/10 text-brume"}`}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export function SiteHeader({ onHome }: { onHome: () => void }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-4 sm:px-6">
      <Link href="/" onClick={onHome} className="group flex items-center gap-2.5 rounded-lg" aria-label="Chouffinder, retour à l'accueil">
        <TankardLogo className="size-9 transition-transform duration-200 ease-punch group-hover:-rotate-12 group-hover:scale-110" />
        <span className="font-display text-xl uppercase tracking-wide">Chouffinder</span>
      </Link>
      <SoundToggle />
    </header>
  );
}
