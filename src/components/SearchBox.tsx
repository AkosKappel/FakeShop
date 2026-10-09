import { useId, useState } from 'react';
import { Form, useLocation, useSearchParams } from 'react-router';
import { LuSearch, LuX } from 'react-icons/lu';

import { getCatalog } from '../lib/api';

export default function SearchBox({ onSearch }: { onSearch?: () => void }) {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const currentQuery = pathname === '/products' ? (params.get('q') ?? '') : '';
  return (
    // Remount when the URL query changes so the box always shows it.
    <SearchForm key={currentQuery} initial={currentQuery} onSearch={onSearch} />
  );
}

function SearchForm({
  initial,
  onSearch,
}: {
  initial: string;
  onSearch?: () => void;
}) {
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const listId = useId();

  // Native <datalist> suggestions, filled from the cached catalog on first focus.
  const loadSuggestions = () => {
    if (suggestions.length > 0) return;
    getCatalog()
      .then((products) => setSuggestions(products.map((p) => p.title)))
      .catch(() => {});
  };

  return (
    <Form
      action="/products"
      role="search"
      className="relative w-full"
      onSubmit={onSearch}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search products
      </label>
      <LuSearch
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
      />
      <input
        id={`${listId}-input`}
        type="search"
        name="q"
        list={listId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={loadSuggestions}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setQuery('');
        }}
        placeholder="Search products and brands"
        autoComplete="off"
        enterKeyHint="search"
        className="field rounded-full pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
      />
      <datalist id={listId}>
        {suggestions.map((title) => (
          <option key={title} value={title} />
        ))}
      </datalist>
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Clear search"
        >
          <LuX className="size-4" />
        </button>
      )}
    </Form>
  );
}
