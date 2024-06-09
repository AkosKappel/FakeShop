import './App.css';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // TODO 404 page: You can provide a way better UX than this when your app throws errors by providing your own ErrorBoundary or errorElement prop on your route.

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="products"
          element={<ProductsPage title="All Products" />}
        />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="products/category/:category" element={<ProductsPage />} />
        <Route path="cart" element={<HomePage />} />
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
