"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { fetchJudge, toApiError, type ApiError } from "@/lib/client/api";
import { ACHIEVEMENTS, LOADING_TIPS, pick } from "@/lib/client/copy";
import { sfx } from "@/lib/client/preferences";
import type { JudgeResult, KnownResult, UnknownResult } from "@/lib/types";
import { AchievementToast, type ToastData } from "./AchievementToast";
import { LoadingCard } from "./LoadingCard";
import { BlockedNotice, ErrorNotice, InvalidNotice } from "./Notices";
import { QuerySync } from "./QuerySync";
import { SearchForm } from "./SearchForm";
import { SiteHeader } from "./SiteHeader";
import { StatsFooter } from "./StatsFooter";
import { VerdictCard } from "./VerdictCard";
import type { SadVariant } from "./SadReaction";

// Chargés à la demande : ils ne pèsent rien tant qu'on n'en a pas besoin.
const loadMlgCombo = () => import("./MlgCombo");
const loadSadReaction = () => import("./SadReaction");
const loadCestPasFaux = () => import("./CestPasFaux");
const MlgCombo = lazy(loadMlgCombo);
const SadReaction = lazy(loadSadReaction);
const CestPasFaux = lazy(loadCestPasFaux);

/** Le combo MLG surprend parce qu'il est rare : 1 chance sur 3 (toujours si légendaire). */
const MLG_CHANCE = 1 / 3;
/** La réaction triste est encore plus rare. */
const SAD_CHANCE = 1 / 4;

type View =
  | { kind: "idle" }
  | { kind: "loading"; query: string; tip: string }
  | { kind: "result"; query: string; result: JudgeResult; nonce: number }
  | { kind: "error"; query: string; error: ApiError; nonce: number };

type Overlay =
  | { kind: "mlg"; id: number; seed: number; word: string; legendary: boolean }
  | { kind: "sad"; id: number; word: string; variant: SadVariant };

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Morphing du héros (plein écran vers compact) avec les View Transitions, si dispo. */
function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (callback: () => void) => unknown };
  if (typeof doc.startViewTransition !== "function" || prefersReducedMotion()) {
    update();
    return;
  }
  doc.startViewTransition(() => flushSync(update));
}

function describe(result: JudgeResult): string {
  switch (result.status) {
    case "known":
      return `Verdict : « ${result.word} » est ${result.chouffin ? "chouffin" : "pas chouffin"}. Indice de chouffinitude : ${result.score} sur 100.${
        result.flipped ? " Verdict renversé par la communauté." : ""
      }`;
    case "unknown":
      return `C'est pas faux : « ${result.word} » n'est pas encore dans la base.`;
    case "blocked":
    case "invalid":
      return result.message;
  }
}

function Reveal({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}

export function ChouffinderApp() {
  const [input, setInput] = useState("");
  const [view, setView] = useState<View>({ kind: "idle" });
  const [compact, setCompact] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [shaking, setShaking] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [statsKey, setStatsKey] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const request = useRef<{ id: number; controller: AbortController | null }>({ id: 0, controller: null });
  /** La valeur de `?q=` telle que l'application la connaît (undefined avant le premier rendu). */
  const urlQuery = useRef<string | undefined>(undefined);
  const compactRef = useRef(false);
  const nonce = useRef(0);
  const shakeTimer = useRef<number | undefined>(undefined);

  const warmup = useCallback(() => {
    void loadMlgCombo();
    void loadSadReaction();
    void loadCestPasFaux();
  }, []);

  const announce = useCallback((message: string) => {
    // Un espace insécable en alternance force la relecture d'un message identique.
    setAnnouncement((previous) => (previous === message ? `${message} ` : message));
  }, []);

  const writeUrl = useCallback((query: string, mode: "push" | "replace") => {
    urlQuery.current = query;
    const url = query ? `/?${new URLSearchParams({ q: query }).toString()}` : "/";
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }, []);

  const shake = useCallback(() => {
    if (prefersReducedMotion()) return;
    window.clearTimeout(shakeTimer.current);
    setShaking(true);
    shakeTimer.current = window.setTimeout(() => setShaking(false), 520);
  }, []);

  /** Décide, au hasard, de la petite (ou grosse) surprise qui accompagne un verdict. */
  const celebrate = useCallback(
    (result: JudgeResult) => {
      if (result.status !== "known") return;
      const reduced = prefersReducedMotion();

      if (result.chouffin) {
        if (result.legendary || Math.random() < MLG_CHANCE) {
          setToast({
            id: Date.now(),
            points: result.legendary ? 100 : pick([10, 20, 30, 50]),
            title: result.legendary ? "Légende vivante" : pick(ACHIEVEMENTS),
          });
          if (reduced) {
            sfx("achievement");
            return;
          }
          setOverlay({
            kind: "mlg",
            id: Date.now(),
            seed: Math.floor(Math.random() * 2 ** 31),
            word: result.word,
            legendary: result.legendary,
          });
          shake();
          return;
        }
        sfx("stamp");
        return;
      }

      if (!reduced && Math.random() < SAD_CHANCE) {
        setOverlay({ kind: "sad", id: Date.now(), word: result.word, variant: Math.random() < 0.5 ? "bsod" : "nope" });
        return;
      }
      sfx("flat");
    },
    [shake],
  );

  const search = useCallback(
    async (raw: string) => {
      const query = raw.trim();
      if (!query) return;
      request.current.controller?.abort();
      const controller = new AbortController();
      const id = request.current.id + 1;
      request.current = { id, controller };
      setOverlay(null);

      const showLoading = () => setView({ kind: "loading", query, tip: pick(LOADING_TIPS) });
      if (!compactRef.current) {
        compactRef.current = true;
        withViewTransition(() => {
          setCompact(true);
          showLoading();
        });
      } else {
        showLoading();
      }

      try {
        const result = await fetchJudge(query, controller.signal);
        if (request.current.id !== id) return;
        // On ne garde pas d'insulte (ni de saisie invalide) dans une URL partageable.
        if (result.status === "blocked" || result.status === "invalid") writeUrl("", "replace");
        nonce.current += 1;
        setView({ kind: "result", query, result, nonce: nonce.current });
        announce(describe(result));
        celebrate(result);
      } catch (caught) {
        const error = toApiError(caught);
        if (error.kind === "aborted" || request.current.id !== id) return;
        nonce.current += 1;
        setView({ kind: "error", query, error, nonce: nonce.current });
        announce(error.serverMessage ?? "Le Chouffinder n'a pas pu répondre. Réessaie.");
      }
    },
    [announce, celebrate, writeUrl],
  );

  const resetView = useCallback(() => {
    request.current.controller?.abort();
    request.current = { id: request.current.id + 1, controller: null };
    setOverlay(null);
    const apply = () => {
      setView({ kind: "idle" });
      setCompact(false);
    };
    if (compactRef.current) {
      compactRef.current = false;
      withViewTransition(apply);
    } else {
      apply();
    }
  }, []);

  /** Source de vérité pour les liens partagés et le bouton précédent. */
  const handleUrlQuery = useCallback(
    (raw: string | null) => {
      const query = (raw ?? "").trim();
      if (query === urlQuery.current) return;
      urlQuery.current = query;
      if (!query) {
        setInput("");
        resetView();
        return;
      }
      setInput(query);
      void search(query);
    },
    [resetView, search],
  );

  const submit = useCallback(
    (query: string) => {
      writeUrl(query, urlQuery.current === query ? "replace" : "push");
      void search(query);
    },
    [search, writeUrl],
  );

  const goHome = useCallback(() => {
    urlQuery.current = "";
    setInput("");
    resetView();
  }, [resetView]);

  const focusInput = useCallback(() => {
    const node = inputRef.current;
    if (!node) return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    node.focus({ preventScroll: true });
    node.select();
  }, []);

  const chooseAnotherWord = useCallback(() => {
    setInput("");
    goHome();
    window.history.replaceState(null, "", "/");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [goHome]);

  const handleVoted = useCallback(
    (next: JudgeResult, alreadyVoted: boolean, previous: KnownResult | UnknownResult) => {
      setView((current) => (current.kind === "result" ? { ...current, result: next } : current));
      setStatsKey((key) => key + 1);

      if (alreadyVoted) {
        announce("Ton vote était déjà compté.");
        return;
      }
      if (previous.status === "unknown" && next.status === "known") {
        setToast({ id: Date.now(), points: 50, title: "Parrain d'un mot" });
        sfx("achievement");
        announce(`Mot adopté par la communauté : « ${next.word} » est ${next.chouffin ? "chouffin" : "pas chouffin"}.`);
        resultRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }
      if (previous.status === "known" && next.status === "known" && previous.chouffin !== next.chouffin) {
        setToast({ id: Date.now(), points: 30, title: "Le peuple a parlé" });
        sfx("flip");
        shake();
        announce(`Verdict renversé ! « ${next.word} » est maintenant ${next.chouffin ? "chouffin" : "pas chouffin"}.`);
        return;
      }
      announce("Vote enregistré. Merci !");
    },
    [announce, shake],
  );

  const closeOverlay = useCallback(() => setOverlay(null), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const resultNonce = view.kind === "result" || view.kind === "error" ? view.nonce : 0;
  useEffect(() => {
    if (resultNonce === 0) return;
    const node = resultRef.current;
    if (!node) return;
    // Sur petit écran, on amène le verdict sous les yeux s'il est trop bas.
    if (node.getBoundingClientRect().top > window.innerHeight * 0.6) {
      node.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [resultNonce]);

  useEffect(() => () => window.clearTimeout(shakeTimer.current), []);

  function renderView(): ReactNode {
    switch (view.kind) {
      case "idle":
        return null;
      case "loading":
        return (
          <m.div key="loading" exit={{ opacity: 0, transition: { duration: 0 } }}>
            <LoadingCard query={view.query} tip={view.tip} />
          </m.div>
        );
      case "error":
        return (
          <Reveal key={`error-${view.nonce}`}>
            <ErrorNotice error={view.error} onRetry={() => void search(view.query)} />
          </Reveal>
        );
      case "result": {
        const { result } = view;
        const key = `${view.nonce}-${result.status}`;
        switch (result.status) {
          case "known":
            return (
              <Reveal key={key}>
                <VerdictCard result={result} onVoted={handleVoted} onAnotherWord={focusInput} />
              </Reveal>
            );
          case "unknown":
            return (
              <Reveal key={key}>
                <CestPasFaux result={result} onVoted={handleVoted} />
              </Reveal>
            );
          case "blocked":
            return (
              <Reveal key={key}>
                <BlockedNotice message={result.message} onReset={chooseAnotherWord} />
              </Reveal>
            );
          case "invalid":
            return (
              <Reveal key={key}>
                <InvalidNotice message={result.message} />
              </Reveal>
            );
        }
      }
    }
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Suspense fallback={null}>
          <QuerySync onQuery={handleUrlQuery} />
        </Suspense>

        <div className="flex min-h-svh flex-col overflow-x-clip">
          <SiteHeader onHome={goHome} />

          <main className={`mx-auto w-full max-w-3xl flex-1 px-4 pb-12 sm:px-6 ${shaking ? "is-shaking" : ""}`}>
            <section
              className={`relative flex flex-col items-center text-center ${compact ? "pt-6 sm:pt-10" : "pt-[9vh] sm:pt-[13vh]"}`}
            >
              {!compact ? <div className="sunburst" aria-hidden="true" /> : null}
              <h1
                className={`vt-title meme-text relative ${
                  compact ? "text-[clamp(1.9rem,7vw,3.2rem)]" : "text-[clamp(2.9rem,12vw,6.8rem)]"
                }`}
              >
                C&apos;est chouffin{compact ? " " : <br />}ou pas ?
              </h1>
              <div className={`relative w-full ${compact ? "mt-5" : "mt-7 sm:mt-9"}`}>
                <SearchForm
                  value={input}
                  onValueChange={setInput}
                  onSubmit={submit}
                  loading={view.kind === "loading"}
                  compact={compact}
                  inputRef={inputRef}
                  onWarmup={warmup}
                />
              </div>
              {!compact ? (
                <div className="relative mt-10">
                  <p className="meme-text text-[clamp(1.35rem,4.8vw,2.4rem)]">Le Chouffinder a toujours raison*</p>
                  <p className="mt-2 text-sm text-brume">*Sauf quand la communauté le contredit.</p>
                </div>
              ) : null}
            </section>

            <div ref={resultRef} className="mt-8 scroll-mt-4">
              <Suspense fallback={view.kind === "result" ? <LoadingCard query={view.query} tip="Déroulage du parchemin..." /> : null}>
                <AnimatePresence mode="wait" initial={false}>
                  {renderView()}
                </AnimatePresence>
              </Suspense>
            </div>
          </main>

          <StatsFooter refreshKey={statsKey} />
        </div>

        <Suspense fallback={null}>
          <AnimatePresence>
            {overlay?.kind === "mlg" ? (
              <MlgCombo
                key={overlay.id}
                seed={overlay.seed}
                word={overlay.word}
                legendary={overlay.legendary}
                onDone={closeOverlay}
              />
            ) : null}
            {overlay?.kind === "sad" ? (
              <SadReaction key={overlay.id} word={overlay.word} variant={overlay.variant} onDone={closeOverlay} />
            ) : null}
          </AnimatePresence>
        </Suspense>

        <AchievementToast toast={toast} onDismiss={dismissToast} />

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </MotionConfig>
    </LazyMotion>
  );
}
