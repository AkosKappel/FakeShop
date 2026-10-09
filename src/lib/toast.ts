import { createStore, useStore } from './store';

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick?: () => void; to?: string };
}

const TOAST_DURATION = 5000;
const toastStore = createStore<Toast[]>([]);
let nextId = 1;

export function dismissToast(id: number) {
  toastStore.set((toasts) => toasts.filter((toast) => toast.id !== id));
}

export function toast(message: string, action?: Toast['action']) {
  const id = nextId++;
  // Only the latest toast matters in a shop; older ones would just pile up.
  toastStore.set([{ id, message, action }]);
  window.setTimeout(() => dismissToast(id), TOAST_DURATION);
}

export function useToasts() {
  return useStore(toastStore);
}
