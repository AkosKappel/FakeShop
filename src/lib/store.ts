import { useSyncExternalStore } from 'react';

export interface Store<T> {
  get(): T;
  set(next: T | ((previous: T) => T)): void;
  subscribe(listener: () => void): () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next) {
      value = next instanceof Function ? next(value) : next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/**
 * A store saved in localStorage. Other tabs pick up changes through the
 * `storage` event, so the cart and wishlist stay in sync everywhere.
 */
export function createLocalStore<T>(key: string, fallback: T): Store<T> {
  const store = createStore(readStorage(key, fallback));

  window.addEventListener('storage', (event) => {
    if (event.key === key) store.set(readStorage(key, fallback));
  });

  return {
    ...store,
    set(next) {
      store.set(next);
      try {
        localStorage.setItem(key, JSON.stringify(store.get()));
      } catch {
        // Storage can be full or blocked (private mode); keep the in-memory value.
      }
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get);
}
