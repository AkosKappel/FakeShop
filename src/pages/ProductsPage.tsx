import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Product } from '../types/Product.interface';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import { titleCase } from '../utils/helpers';
import { fetchProducts } from '../utils/dataFetch';

interface ProductsPageProps {
  title?: string;
  numberOfProducts?: number;
}

const ProductsPage = ({ title, numberOfProducts = 20 }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    const fetchProductsByCategory = async (category?: string) => {
      try {
        setLoading(true);
        const data = await fetchProducts(numberOfProducts, category);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory(category);
  }, [category, numberOfProducts]);

  return (
    <div>
      <Helmet>
        <title>{titleCase(category) || title || 'Products'} | FakeShop</title>
      </Helmet>
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
      <div className="h-16" />
    </div>
  );
};

export default ProductsPage;
