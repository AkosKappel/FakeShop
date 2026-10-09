import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

import Layout from './layouts/Layout';
import { getCatalog, getProduct } from './lib/api';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PageSkeleton from './pages/PageSkeleton';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import WishlistPage from './pages/WishlistPage';

const catalogLoader = async () => ({ catalog: await getCatalog() });

// Pages off the browsing path load on demand; the checkout chunk carries React Hook Form.
const lazyPage = (load: () => Promise<{ default: ComponentType }>) => () =>
  load().then((module) => ({ Component: module.default }));

export const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          errorElement: <ErrorPage />,
          hydrateFallbackElement: <PageSkeleton />,
          children: [
            { index: true, element: <HomePage />, loader: catalogLoader },
            {
              path: 'products',
              element: <ProductsPage />,
              loader: catalogLoader,
            },
            {
              path: 'category/:slug',
              element: <ProductsPage />,
              loader: catalogLoader,
            },
            {
              path: 'products/:id',
              element: <ProductPage />,
              // Not awaited: the page shows a skeleton while the product loads.
              loader: ({ params }) => ({
                product: getProduct(params.id!),
                catalog: getCatalog(),
              }),
            },
            {
              path: 'categories',
              element: <CategoriesPage />,
              loader: catalogLoader,
            },
            {
              path: 'wishlist',
              element: <WishlistPage />,
              loader: catalogLoader,
            },
            { path: 'cart', element: <CartPage /> },
            {
              path: 'checkout',
              lazy: lazyPage(() => import('./pages/CheckoutPage')),
            },
            {
              path: 'orders',
              lazy: lazyPage(() => import('./pages/OrdersPage')),
            },
            {
              path: 'orders/:number',
              lazy: lazyPage(() => import('./pages/OrderPage')),
            },
            {
              path: 'about',
              lazy: lazyPage(() => import('./pages/AboutPage')),
            },
            // Links from the 2024 version.
            { path: 'home', element: <Navigate to="/" replace /> },
            {
              path: 'products/category/:old',
              element: <Navigate to="/categories" replace />,
            },
            { path: '*', element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
