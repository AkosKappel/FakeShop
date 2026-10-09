import { Link } from 'react-router';
import { LuChevronRight } from 'react-icons/lu';

interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-zinc-500 dark:text-zinc-400">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && (
              <LuChevronRight className="size-4 shrink-0" aria-hidden="true" />
            )}
            {item.to ? (
              <Link
                to={item.to}
                className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="line-clamp-1 font-medium text-zinc-900 dark:text-zinc-100"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
