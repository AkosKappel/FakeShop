import { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import ProductsPage from './ProductsPage';
import Spinner from '../components/Spinner';
import { Product } from '../types/Product.interface';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=10');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex items-center justify-center flex-col">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div>
          <Carousel products={products} title="Best Sellers" />
          <ProductsPage title="Recommended for you" numberOfProducts={4} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
