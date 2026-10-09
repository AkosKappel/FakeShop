import { createBrowserRouter, Navigate } from 'react-router';

import Layout from './layouts/Layout';
import { getCatalog, getProduct } from './lib/api';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CategoriesPage from './pages/CategoriesPage';
import CheckoutPage from './pages/CheckoutPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import PageSkeleton from './pages/PageSkeleton';
import ProductPage from './pages/ProductPage';
import ProductsPage from './pages/ProductsPage';
import WishlistPage from './pages/WishlistPage';

const catalogLoader = async () => ({ catalog: await getCatalog() });

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
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'orders', element: <OrdersPage /> },
            { path: 'orders/:number', element: <OrderPage /> },
            { path: 'about', element: <AboutPage /> },
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
