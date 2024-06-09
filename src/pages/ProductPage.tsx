import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlus, FaMinus, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { Product } from '../types/Product.interface';
import Spinner from '../components/Spinner';
import { titleCase, formatRating } from '../utils/helpers';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
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
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuantity(+e.target.value);
  const handleAddToCart = () => {
    // TODO: Add product to cart and redirect to cart page
    console.log(`Product added to cart: ${product?.title} ${quantity} times`);
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
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {product.rating.rate >= star ? (
                        <FaStar />
                      ) : product.rating.rate >= star - 0.5 ? (
                        <FaStarHalfAlt />
                      ) : (
                        <FaStar className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {formatRating(product.rating.rate, product.rating.count)}
                </span>
              </div>

              <p className="text-gray-800 text-2xl mt-4">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between items-center my-4">
              <div className="flex items-center">
                <button
                  className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400"
                  onClick={handleDecrement}
                >
                  <FaMinus />
                </button>
                <input
                  className="w-12 h-10 text-center border border-gray-400 rounded-lg mx-2"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                />
                <button
                  className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400"
                  onClick={handleIncrement}
                >
                  <FaPlus />
                </button>
              </div>
              <button
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                onClick={handleAddToCart}
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
