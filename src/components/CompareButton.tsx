import { LuScale } from 'react-icons/lu';

import { MAX_COMPARE, compareStore, toggleId, useCompare } from '../lib/lists';
import { toast } from '../lib/toast';

export default function CompareButton({
  productId,
  title,
}: {
  productId: number;
  title: string;
}) {
  const ids = useCompare();
  const selected = ids.includes(productId);

  const handleClick = () => {
    if (!selected && ids.length >= MAX_COMPARE) {
      toast(`You can compare up to ${MAX_COMPARE} products`, {
        label: 'Open comparison',
        to: '/compare',
      });
      return;
    }
    compareStore.set((current) => toggleId(current, productId, MAX_COMPARE));
    toast(selected ? 'Removed from comparison' : 'Added to comparison', {
      label: 'Compare now',
      to: '/compare',
    });
  };

  return (
    <button
      type="button"
      className="btn-icon size-11 ring-1 ring-zinc-300 aria-pressed:bg-brand-50 aria-pressed:text-brand-700 aria-pressed:ring-brand-600 dark:ring-zinc-700 dark:aria-pressed:bg-brand-950 dark:aria-pressed:text-brand-400"
      onClick={handleClick}
      aria-pressed={selected}
      aria-label={`Compare ${title}`}
      title={selected ? 'Remove from comparison' : 'Compare'}
    >
      <LuScale className="size-5" />
    </button>
  );
}
