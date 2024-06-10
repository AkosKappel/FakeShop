import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Product } from '../types/Product.interface';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';
import {
  titleCase,
  calculateOriginalPrice,
  randomNumber,
} from '../utils/helpers';

interface ProductsPageProps {
  title?: string;
  numberOfProducts?: number;
}

const ProductsPage = ({ title, numberOfProducts = 20 }: ProductsPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [page, setPage] = useState<number>(1); TODO: Implement pagination
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    const fetchProducts = async (category?: string) => {
      try {
        const api =
          process.env.API_URL +
          '/products' +
          (category ? `/category/${category}` : '') +
          `?limit=${numberOfProducts}`;

        const response = await fetch(api);
        const data = await response.json();

        // Simulate a discount between 10% and 35% on 30% of products
        data.forEach((product: Product) => {
          const discount =
            Math.random() < 0.3 ? Math.round(randomNumber(10, 35)) : 0;
          product.fullPrice = calculateOriginalPrice(product.price, discount);
        });

        // Shuffle the products
        data.sort(() => Math.random() - 0.5);
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
    </div>
  );
};

export default ProductsPage;
