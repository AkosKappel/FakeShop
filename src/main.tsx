import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import flagFontUrl from 'country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2?url';

import './index.css';
import { router } from './router';

// The 2024 version kept the whole checkout form, card number included, in
// localStorage. Remove it (and the old cart format) from returning browsers.
for (const key of ['checkoutFormData', 'cart']) {
  localStorage.removeItem(key);
}

// Windows has no flag emoji; this loads a small self-hosted flag font there only.
polyfillCountryFlagEmojis('Twemoji Country Flags', flagFontUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
