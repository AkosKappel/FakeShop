import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/Product.interface';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { category } = useParams<{ category: string }>();

  const fetchProducts = async (count: number, category?: string) => {
    try {
      const apiUrl = category
        ? `/api/products/category/${category}`
        : '/api/products';
      const response = await fetch(apiUrl + `?limit=${count}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(4, category);
  }, [category]);

  return (
    <div>
      {loading ? (
        <Spinner description="Loading products" loading={loading} />
      ) : (
        <div className="m-4">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-center">Best Sellers</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
