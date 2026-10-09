import { Link } from 'react-router';

export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-brand-600" />
      <path
        d="M10 12h12l-1 13H11z"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M13 12v-1.5a3 3 0 0 1 6 0V12"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2 rounded-lg text-xl font-extrabold tracking-tight"
    >
      <LogoMark />
      <span>
        Fake<span className="text-brand-600 dark:text-brand-400">Shop</span>
      </span>
    </Link>
  );
}
