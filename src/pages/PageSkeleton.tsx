import { ProductGridSkeleton } from '../components/ProductGrid';

/** Shown on the first load while the catalog arrives. */
export default function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="h-9 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <ProductGridSkeleton />
    </div>
  );
}
