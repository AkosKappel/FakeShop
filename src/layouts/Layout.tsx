import { useEffect, useRef } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from 'react-router';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Toaster from '../components/Toaster';

/** Moves focus to the new page's heading so screen readers announce it. */
function useFocusHeadingOnNavigate() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const heading = document.querySelector<HTMLElement>('main h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);
}

export default function Layout() {
  const navigation = useNavigation();
  useFocusHeadingOnNavigate();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {navigation.state !== 'idle' && (
        <div
          role="progressbar"
          aria-label="Loading page"
          className="fixed inset-x-0 top-0 z-50 h-1 animate-pulse bg-brand-500"
        />
      )}
      <Header />
      <main
        id="main"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8 [&_h1]:outline-none"
      >
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <ScrollRestoration />
    </div>
  );
}
