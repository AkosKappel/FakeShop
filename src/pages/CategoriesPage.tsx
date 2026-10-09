import { Link, useLoaderData } from 'react-router';

import Breadcrumbs from '../components/Breadcrumbs';
import type { ProductSummary } from '../lib/api';
import { CATEGORY_GROUPS, categoryName } from '../lib/catalog';
import { pluralize } from '../lib/format';

export default function CategoriesPage() {
  const { catalog } = useLoaderData<{ catalog: ProductSummary[] }>();

  const inCategory = (slug: string) =>
    catalog.filter((product) => product.category === slug);

  return (
    <>
      <title>Categories | FakeShop</title>
      <Breadcrumbs
        items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]}
      />
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
        Shop by category
      </h1>
      <div className="space-y-12">
        {CATEGORY_GROUPS.map((group) => (
          <section
            key={group.slug}
            id={group.slug}
            aria-labelledby={`${group.slug}-heading`}
            className="scroll-mt-32"
          >
            <h2 id={`${group.slug}-heading`} className="mb-4 text-xl font-bold">
              {group.name}
            </h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {group.categories.map((slug) => {
                const products = inCategory(slug);
                const cover = [...products].sort(
                  (a, b) => b.rating - a.rating
                )[0];
                return (
                  <li key={slug}>
                    <Link
                      to={`/category/${slug}`}
                      className="card group flex h-full items-center gap-4 p-3 transition-shadow hover:shadow-lg"
                    >
                      {cover && (
                        <span className="image-tile size-20 shrink-0 rounded-xl p-2">
                          <img
                            src={cover.thumbnail}
                            alt=""
                            loading="lazy"
                            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </span>
                      )}
                      <span>
                        <span className="block font-semibold">
                          {categoryName(slug)}
                        </span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          {pluralize(products.length, 'product', 'products')}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
