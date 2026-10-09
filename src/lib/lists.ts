import { createLocalStore, useStore } from './store';

const RECENT_LIMIT = 8;

export const wishlistStore = createLocalStore<number[]>(
  'fakeshop:wishlist',
  []
);
export const recentStore = createLocalStore<number[]>('fakeshop:recent', []);

export function useWishlist() {
  return useStore(wishlistStore);
}

export function toggleWishlist(id: number): boolean {
  const added = !wishlistStore.get().includes(id);
  wishlistStore.set((ids) =>
    added ? [id, ...ids] : ids.filter((existing) => existing !== id)
  );
  return added;
}

export function useRecentlyViewed() {
  return useStore(recentStore);
}

export function markViewed(id: number) {
  recentStore.set((ids) =>
    [id, ...ids.filter((existing) => existing !== id)].slice(0, RECENT_LIMIT)
  );
}

/** Keeps the order of `ids` and skips ids missing from the catalog. */
export function pickByIds<T extends { id: number }>(
  items: T[],
  ids: number[]
): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
