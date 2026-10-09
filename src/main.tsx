import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import './index.css';
import { router } from './router';

// The 2024 version kept the whole checkout form, card number included, in
// localStorage. Remove it (and the old cart format) from returning browsers.
for (const key of ['checkoutFormData', 'cart']) {
  localStorage.removeItem(key);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
