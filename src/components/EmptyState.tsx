import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

interface EmptyStateProps {
  icon: IconType;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  children,
  actions,
}: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        <Icon className="size-8" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      {children && (
        <div className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
          {children}
        </div>
      )}
      {actions && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
