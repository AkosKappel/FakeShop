import { Link } from 'react-router';
import { LuSearch } from 'react-icons/lu';

import EmptyState from '../components/EmptyState';
import SearchBox from '../components/SearchBox';
import { CATEGORY_GROUPS, categoryName } from '../lib/catalog';

const POPULAR = ['smartphones', 'laptops', 'womens-dresses', 'fragrances'];

export default function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <>
      <title>Not found | FakeShop</title>
      <h1 className="sr-only">Not found</h1>
      <EmptyState
        icon={LuSearch}
        title={`This ${what} does not exist`}
        actions={
          <div className="w-full max-w-md space-y-6">
            <SearchBox />
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR.map((slug) => (
                <Link
                  key={slug}
                  to={`/category/${slug}`}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  {categoryName(slug)}
                </Link>
              ))}
            </div>
            <Link to="/" className="btn-primary">
              Go to the home page
            </Link>
          </div>
        }
      >
        <p>
          It may have been moved, or the link is wrong. Search the shop or
          browse one of {CATEGORY_GROUPS.length} departments.
        </p>
      </EmptyState>
    </>
  );
}
