import type { ProductSummary } from '../lib/api';
import { finalPrice, isOnSale } from '../lib/catalog';
import { formatPrice } from '../lib/format';

interface PriceProps {
  product: Pick<ProductSummary, 'price' | 'discountPercentage'>;
  size?: 'md' | 'lg';
}

export default function Price({ product, size = 'md' }: PriceProps) {
  const onSale = isOnSale(product);
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={`font-bold ${size === 'lg' ? 'text-3xl' : 'text-lg'} ${onSale ? 'text-brand-700 dark:text-brand-400' : ''}`}
      >
        {onSale && <span className="sr-only">Sale price </span>}
        {formatPrice(finalPrice(product))}
      </span>
      {onSale && (
        <span className="text-sm text-zinc-500 line-through dark:text-zinc-400">
          <span className="sr-only">Regular price </span>
          {formatPrice(product.price)}
        </span>
      )}
    </p>
  );
}
