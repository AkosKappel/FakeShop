import { Link } from 'react-router';
import { LuGithub, LuGlobe, LuLinkedin } from 'react-icons/lu';

import { LogoMark } from './Logo';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { to: '/products', label: 'All products' },
      { to: '/categories', label: 'Categories' },
      { to: '/products?sale=1&sort=discount', label: 'Deals' },
      { to: '/products?sort=rating', label: 'Top rated' },
    ],
  },
  {
    title: 'Your account',
    links: [
      { to: '/cart', label: 'Cart' },
      { to: '/wishlist', label: 'Wishlist' },
      { to: '/orders', label: 'Orders' },
    ],
  },
  {
    title: 'Project',
    links: [
      { to: '/about', label: 'About FakeShop' },
      { to: '/about#tech', label: 'How it is built' },
      { to: '/about#demo', label: 'Demo tips' },
    ],
  },
];

const SOCIAL = [
  {
    href: 'https://github.com/AkosKappel/FakeShop',
    label: 'Source code on GitHub',
    icon: LuGithub,
  },
  {
    href: 'https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220/',
    label: 'Ákos Kappel on LinkedIn',
    icon: LuLinkedin,
  },
  {
    href: 'https://portfolio-taupe-eta-51.vercel.app/',
    label: 'Portfolio of Ákos Kappel',
    icon: LuGlobe,
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-12 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <p className="flex items-center gap-2 text-lg font-extrabold">
            <LogoMark className="size-7" />
            FakeShop
          </p>
          <p className="mt-3 max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
            A demo online store. Browse, fill your cart and check out: nothing
            is for sale, no payment is taken and nothing ships.
          </p>
          <ul className="mt-5 flex gap-1">
            {SOCIAL.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="mb-3 text-sm font-bold">{column.title}</p>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Ákos Kappel. Product data and images from{' '}
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            DummyJSON
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
