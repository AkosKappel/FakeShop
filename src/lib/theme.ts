import { useSyncExternalStore } from 'react';

import { createLocalStore } from './store';

export type Theme = 'light' | 'dark';

// null follows the system setting. index.html applies the same key before
// the app loads, so the page never flashes in the wrong theme.
const themeStore = createLocalStore<Theme | null>('fakeshop:theme', null);
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

const resolvedTheme = (): Theme =>
  themeStore.get() ?? (systemDark.matches ? 'dark' : 'light');

function subscribe(listener: () => void) {
  const unsubscribe = themeStore.subscribe(listener);
  systemDark.addEventListener('change', listener);
  return () => {
    unsubscribe();
    systemDark.removeEventListener('change', listener);
  };
}

subscribe(() =>
  document.documentElement.classList.toggle('dark', resolvedTheme() === 'dark')
);

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, resolvedTheme);
}

export function setTheme(theme: Theme) {
  themeStore.set(theme);
}
