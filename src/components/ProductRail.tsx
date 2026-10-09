import { useRef, type ReactNode } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import ProductCard from './ProductCard';
import type { ProductSummary } from '../lib/api';

interface ProductRailProps {
  title: string;
  products: ProductSummary[];
  action?: ReactNode;
}

/** A horizontally scrolling row of products: swipeable on touch, arrow buttons on desktop. */
export default function ProductRail({
  title,
  products,
  action,
}: ProductRailProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const headingId = `rail-${title.toLowerCase().replace(/\W+/g, '-')}`;

  if (products.length === 0) return null;

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 id={headingId} className="text-xl font-bold sm:text-2xl">
          {title}
        </h2>
        <div className="flex items-center gap-1">
          {action}
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              className="btn-icon ring-1 ring-zinc-300 dark:ring-zinc-700"
              onClick={() => scroll(-1)}
              aria-label={`Scroll ${title} left`}
            >
              <LuChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              className="btn-icon ring-1 ring-zinc-300 dark:ring-zinc-700"
              onClick={() => scroll(1)}
              aria-label={`Scroll ${title} right`}
            >
              <LuChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <ul
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:gap-5"
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="flex w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[23%]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
