import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Spinner from '../components/Spinner';
import QuantityPicker from '../components/QuantityPicker';
import StarsRating from '../components/StarsRating';
import { Product } from '../types/Product.interface';
import { titleCase } from '../utils/helpers';
import { useCart } from '../hooks/CartHooks';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const api = process.env.API_URL;
        const response = await fetch(`${api}/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);

  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const handleAddButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    addToCart({ ...(product as Product), quantity });
  };

  return (
    <div>
      <Helmet>
        <title>{product?.title || 'FakeShop'}</title>
      </Helmet>
      {loading || !product ? (
        <Spinner description="Loading product" loading={loading} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 m-4 gap-x-8">
          <div className="hidden lg:block">
            <img
              className="object-contain object-center h-5/6"
              src={product.image}
              alt={product.title}
              title={product.title}
            />
          </div>
          <div className="m-4 lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center">
              {product.title}
            </h1>
            <div className="flex items-center justify-center my-4">
              <span className="text-gray-600">Category:</span>
              <Link to={`/products/category/${product.category}`}>
                <p className="text-gray-800 ml-2 font-semibold hover:text-pink-400">
                  {titleCase(product.category)}
                </p>
              </Link>
            </div>
            <div className="my-6">
              <p className="text-gray-700 mt-4">{product.description}</p>
            </div>

            <div className="flex justify-between items-center my-4">
              <StarsRating
                rating={product.rating.rate}
                reviewCount={product.rating.count}
              />

              <p className="text-gray-800 text-2xl">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between items-center my-4">
              <QuantityPicker
                quantity={quantity}
                setQuantity={(e) => setQuantity(+e.target.value)}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                editable={true}
              />
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                onClick={handleAddButton}
              >
                Add to cart
              </button>
            </div>
          </div>
          <div className="lg:hidden mt-4 flex justify-center">
            <img
              className="object-contain object-center max-h-4/6"
              src={product.image}
              alt={product.title}
              title={product.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
