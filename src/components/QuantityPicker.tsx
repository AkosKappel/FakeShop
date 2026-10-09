import { LuMinus, LuPlus } from 'react-icons/lu';

import { clampQuantity, maxQuantity } from '../lib/cart';

interface QuantityPickerProps {
  quantity: number;
  stock: number;
  onChange: (quantity: number) => void;
  label: string;
}

export default function QuantityPicker({
  quantity,
  stock,
  onChange,
  label,
}: QuantityPickerProps) {
  const max = maxQuantity(stock);
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-11 items-center rounded-full ring-1 ring-zinc-300 ring-inset dark:ring-zinc-700"
    >
      <button
        type="button"
        className="btn-icon"
        onClick={() => onChange(clampQuantity(quantity - 1, stock))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <LuMinus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={quantity}
        aria-label="Quantity"
        onChange={(event) =>
          onChange(clampQuantity(event.target.valueAsNumber, stock))
        }
        className="w-10 [appearance:textfield] bg-transparent text-center text-sm font-semibold tabular-nums focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        className="btn-icon"
        onClick={() => onChange(clampQuantity(quantity + 1, stock))}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        <LuPlus className="size-4" />
      </button>
    </div>
  );
}
