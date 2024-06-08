import { useState, useEffect } from 'react';
import { Product } from '../types/Product.interface';
import Spinner from '../components/Spinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async (count: number) => {
      try {
        const response = await fetch(`/api/products?limit=${count}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(4);
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner description="Loading products" />
      ) : (
        products.map((product: Product) => (
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.price}</p>
            <p>{product.description}</p>
            <p>{product.category}</p>
            {/* <img src={product.image} alt={product.title} /> */}
            <p>{product.rating.rate}</p>
            <p>{product.rating.count}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductsPage;
