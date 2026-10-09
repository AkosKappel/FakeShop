import { LuStar } from 'react-icons/lu';

interface RatingProps {
  rating: number;
  label?: string;
  size?: 'sm' | 'md';
}

export default function Rating({ rating, label, size = 'sm' }: RatingProps) {
  const percent = `${(Math.min(Math.max(rating, 0), 5) / 5) * 100}%`;
  const star = size === 'sm' ? 'size-3.5' : 'size-5';
  const stars = (className: string) => (
    <span className={`flex ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <LuStar key={i} className={`${star} fill-current`} />
      ))}
    </span>
  );

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative" aria-hidden="true">
        {stars('text-zinc-300 dark:text-zinc-600')}
        <span
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: percent }}
        >
          {stars('text-amber-400')}
        </span>
      </span>
      <span
        className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-zinc-600 dark:text-zinc-400`}
      >
        <span className="sr-only">Rated </span>
        {rating.toFixed(1)}
        <span className="sr-only"> out of 5</span>
        {label && ` · ${label}`}
      </span>
    </span>
  );
}
