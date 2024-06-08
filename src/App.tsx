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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductPage />} />
        {/* <Route path="*" element={<p>Page not found</p>} /> // TODO */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
