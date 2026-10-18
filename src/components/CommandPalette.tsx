import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { Link, useNavigate } from 'react-router';
import { LuCommand, LuFileText, LuSearch, LuTag } from 'react-icons/lu';

import { getCatalog, type ProductSummary } from '../lib/api';
import { useSession } from '../lib/auth';
import { finalPrice } from '../lib/catalog';
import { formatPrice } from '../lib/format';
import {
  pageOptions,
  paletteOptions,
  wrapIndex,
  type PaletteOption,
} from '../lib/navigation';

const ICONS = { page: LuFileText, category: LuTag, search: LuSearch };

function OptionContent({ option }: { option: PaletteOption }) {
  if (option.product) {
    return (
      <>
        <img
          src={option.product.thumbnail}
          alt=""
          width={40}
          height={40}
          className="image-tile size-10 shrink-0 rounded-lg object-contain"
        />
        <span className="min-w-0 flex-1 truncate">{option.label}</span>
        <span className="font-semibold">
          {formatPrice(finalPrice(option.product))}
        </span>
      </>
    );
  }
  const Icon = ICONS[option.kind as keyof typeof ICONS];
  return (
    <>
      <Icon className="size-5 shrink-0 text-zinc-500" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      {option.kind === 'category' && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Category
        </span>
      )}
    </>
  );
}

/** Ctrl+K or Cmd+K jump list: pages, categories and matching products. */
export default function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [catalog, setCatalog] = useState<ProductSummary[]>([]);
  const signedIn = useSession() !== null;
  const navigate = useNavigate();
  const id = useId();
  const optionId = (index: number) => `${id}-option-${index}`;

  const options = paletteOptions(query, pageOptions(signedIn), catalog);

  const open = () => {
    setQuery('');
    setActive(0);
    dialogRef.current?.showModal();
    // The catalog request is cached, so this is instant after the first page.
    getCatalog()
      .then(setCatalog)
      .catch(() => {});
  };
  const close = () => dialogRef.current?.close();

  const onShortcut = useEffectEvent((event: globalThis.KeyboardEvent) => {
    if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) {
      return;
    }
    event.preventDefault();
    if (dialogRef.current?.open) close();
    else open();
  });

  useEffect(() => {
    document.addEventListener('keydown', onShortcut);
    return () => document.removeEventListener('keydown', onShortcut);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = wrapIndex(
        active,
        event.key === 'ArrowDown' ? 1 : -1,
        options.length
      );
      setActive(next);
      document
        .getElementById(optionId(next))
        ?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && options[active]) {
      event.preventDefault();
      close();
      navigate(options[active].to);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn-icon hidden md:inline-flex"
        onClick={open}
        aria-label="Quick find"
        aria-keyshortcuts="Control+K Meta+K"
        title="Quick find (Ctrl+K)"
      >
        <LuCommand className="size-5" />
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Quick find"
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) close();
        }}
        className="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl rounded-2xl bg-white p-0 text-zinc-900 shadow-2xl dark:bg-zinc-900 dark:text-zinc-100"
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <LuSearch
            className="size-5 shrink-0 text-zinc-400"
            aria-hidden="true"
          />
          <label htmlFor={`${id}-input`} className="sr-only">
            Page or product
          </label>
          <input
            id={`${id}-input`}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a page or find a product"
            autoComplete="off"
            enterKeyHint="go"
            role="combobox"
            aria-controls={`${id}-list`}
            aria-expanded="true"
            aria-autocomplete="list"
            aria-activedescendant={
              options[active] ? optionId(active) : undefined
            }
            className="h-14 w-full bg-transparent text-base placeholder:text-zinc-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Results"
          className="max-h-[min(24rem,60vh)] overflow-y-auto p-2"
        >
          {options.map((option, index) => (
            <li key={option.to} role="presentation">
              <Link
                id={optionId(index)}
                to={option.to}
                role="option"
                tabIndex={-1}
                aria-selected={index === active}
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 aria-selected:bg-brand-50 aria-selected:text-brand-800 dark:hover:bg-zinc-800 dark:aria-selected:bg-brand-950 dark:aria-selected:text-brand-200"
              >
                <OptionContent option={option} />
              </Link>
            </li>
          ))}
        </ul>
        <p className="hidden border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 sm:block dark:border-zinc-800 dark:text-zinc-400 [&_kbd]:rounded [&_kbd]:bg-zinc-100 [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:font-sans dark:[&_kbd]:bg-zinc-800">
          <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open,{' '}
          <kbd>Esc</kbd> to close
        </p>
      </dialog>
    </>
  );
}
