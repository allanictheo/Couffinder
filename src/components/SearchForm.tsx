"use client";

import { AnimatePresence, m, useAnimate, useReducedMotion } from "motion/react";
import { useId, useState, type FormEvent, type RefObject } from "react";
import { EMPTY_HINTS, QUICK_PICKS, pick } from "@/lib/client/copy";
import { MAX_INPUT_LENGTH } from "@/lib/normalize";
import { CloseIcon } from "./art";
import { RotatingPlaceholder } from "./RotatingPlaceholder";

interface SearchFormProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (query: string) => void;
  loading: boolean;
  compact: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  /** Premier signe d'intérêt (focus, frappe) : on précharge les animations. */
  onWarmup: () => void;
}

export function SearchForm({ value, onValueChange, onSubmit, loading, compact, inputRef, onWarmup }: SearchFormProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotion();
  const [hint, setHint] = useState<string | null>(null);
  const hintId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    if (!query) {
      setHint(pick(EMPTY_HINTS));
      if (!reduceMotion && scope.current) {
        void animate(scope.current, { x: [0, -12, 12, -8, 8, -3, 0] }, { duration: 0.42 });
      }
      inputRef.current?.focus();
      return;
    }
    setHint(null);
    // Sur mobile, on range le clavier pour laisser la place au verdict.
    if (window.matchMedia("(pointer: coarse)").matches) inputRef.current?.blur();
    onSubmit(query);
  }

  function handlePick(word: string) {
    setHint(null);
    onValueChange(word);
    onSubmit(word);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="vt-search @container w-full" noValidate>
      <label htmlFor="chouffin-query" className="sr-only">
        Mot à juger
      </label>
      <div ref={scope}>
        <div className="rgb-ring" data-loading={loading}>
          <div className="field-shell flex flex-col gap-2 p-2 @xl:flex-row @xl:items-center @xl:gap-3">
            <div className="relative min-w-0 flex-1">
              <input
                ref={inputRef}
                id="chouffin-query"
                name="q"
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={MAX_INPUT_LENGTH}
                placeholder="Tape un mot"
                value={value}
                onChange={(event) => {
                  onValueChange(event.target.value);
                  if (hint) setHint(null);
                }}
                onFocus={onWarmup}
                aria-describedby={hint ? hintId : undefined}
                aria-invalid={hint ? true : undefined}
                className={`w-full rounded-[16px] bg-transparent py-3 pl-5 pr-12 font-semibold tracking-tight text-parchemin caret-dew outline-none placeholder:text-transparent @xl:pl-6 ${
                  compact ? "text-2xl @xl:text-3xl" : "text-[1.6rem] @xl:text-[2.6rem]"
                }`}
              />
              {value === "" ? <RotatingPlaceholder /> : null}
              {value !== "" ? (
                <button
                  type="button"
                  onClick={() => {
                    onValueChange("");
                    inputRef.current?.focus();
                  }}
                  className="btn-ghost absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-brume"
                  aria-label="Effacer le mot"
                >
                  <CloseIcon className="size-4" />
                </button>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="btn-glossy flex min-h-14 shrink-0 items-center justify-center gap-2 px-6 text-lg @xl:mb-1 @xl:mr-1 @xl:min-h-16 @xl:text-xl"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  <span>Délibération...</span>
                </>
              ) : (
                <span>C&apos;est chouffin ?</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hint ? (
          <m.p
            id={hintId}
            role="alert"
            className="mt-3 text-center text-sm font-medium text-hydromel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {hint}
          </m.p>
        ) : null}
      </AnimatePresence>

      {!compact ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-brume">Essaie :</span>
          {QUICK_PICKS.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => handlePick(word)}
              onPointerEnter={onWarmup}
              className="btn-ghost min-h-10 px-4 font-medium"
            >
              {word}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
