/**
 * Petit store localStorage compatible useSyncExternalStore.
 * - Rendu serveur : valeur par défaut (pas de décalage d'hydratation).
 * - Synchronisé entre onglets via l'événement `storage`.
 * - Repli en mémoire si localStorage est indisponible (navigation privée stricte).
 */

type Listener = () => void;

export interface LocalStore<T> {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
}

export function createLocalStore<T>(
  key: string,
  parse: (raw: string | null) => T,
  serialize: (value: T) => string,
): LocalStore<T> {
  const listeners = new Set<Listener>();
  const serverValue = parse(null);
  let memory: string | null = null;
  let cachedRaw: string | null | undefined;
  let cachedValue: T = serverValue;

  function readRaw(): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memory;
    }
  }

  function getSnapshot(): T {
    const raw = readRaw();
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function onStorage(event: StorageEvent) {
    if (event.key === null || event.key === key) emit();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot,
    getServerSnapshot: () => serverValue,
    set(value) {
      const raw = serialize(value);
      try {
        window.localStorage.setItem(key, raw);
      } catch {
        memory = raw;
      }
      emit();
    },
  };
}
