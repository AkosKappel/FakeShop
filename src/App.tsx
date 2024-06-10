import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import './App.css';
import DefaultLayout from './layouts/DefaultLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SummaryPage from './pages/SummaryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<Navigate to="/" />} />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="products"
          element={<ProductsPage title="All Products" />}
        />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="products/category/:category" element={<ProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/summary" element={<SummaryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    ),
    {
      basename: '/FakeShop',
    }
  );

  return <RouterProvider router={router} />;
}

export default App;
