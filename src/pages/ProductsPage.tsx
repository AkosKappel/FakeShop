import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/Product.interface';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';

interface ProductsPageProps {
  title?: string;
  numberOfProducts?: number;
}

const ProductsPage = ({ title, numberOfProducts = 20 }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [page, setPage] = useState<number>(1); TODO
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    const fetchProducts = async (category?: string) => {
      try {
        const apiUrl = category
          ? `/api/products/category/${category}`
          : '/api/products';
        const response = await fetch(apiUrl + `?limit=${numberOfProducts}`);
        const data = await response.json();
        data.sort(() => Math.random() - 0.5); // Shuffle the products
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(category);
  }, [category, numberOfProducts]);

  return (
    <div>
      {loading ? (
        <Spinner description="Loading products" loading={loading} />
      ) : (
        <div className="m-4">
          <div className="mb-6">
            {title && (
              <h1 className="text-3xl font-semibold text-center">{title}</h1>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
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
