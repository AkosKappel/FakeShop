import { Link } from 'react-router';
import { LuCircleCheck, LuX } from 'react-icons/lu';

import { dismissToast, useToasts } from '../lib/toast';

export default function Toaster() {
  const toasts = useToasts();

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm animate-[toast-in_200ms_ease-out] items-center gap-3 rounded-2xl bg-zinc-900 py-3 pr-2 pl-4 text-sm text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900"
        >
          <LuCircleCheck
            className="size-5 shrink-0 text-emerald-400 dark:text-emerald-600"
            aria-hidden="true"
          />
          <p className="flex-1">{toast.message}</p>
          {toast.action &&
            (toast.action.to ? (
              <Link
                to={toast.action.to}
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 rounded-full px-3 py-1.5 font-semibold text-brand-300 hover:bg-white/10 dark:text-brand-700 dark:hover:bg-zinc-900/10"
              >
                {toast.action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick?.();
                  dismissToast(toast.id);
                }}
                className="shrink-0 cursor-pointer rounded-full px-3 py-1.5 font-semibold text-brand-300 hover:bg-white/10 dark:text-brand-700 dark:hover:bg-zinc-900/10"
              >
                {toast.action.label}
              </button>
            ))}
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white dark:text-zinc-500 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
            aria-label="Dismiss notification"
          >
            <LuX className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
