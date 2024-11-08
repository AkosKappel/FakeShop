import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import ModalImage from './ModalImage';
import { Product } from '../types/Product.interface';
import { formatPrice, truncate } from '../utils/helpers';
import { useCart } from '../hooks/CartHooks';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg flex flex-col justify-between">
        <div
          className="relative flex justify-center items-center m-3 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={openModal}
        >
          <img
            className="h-64 w-64 object-contain object-center"
            src={product.image}
            alt={product.title}
            title={product.title}
          />
          {isHovered && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
              <FaSearch className="text-white text-3xl" />
            </div>
          )}
        </div>
        <div className="p-4">
          <Link to={`/products/${product.id}`}>
            <h2
              className="text-gray-800 text-2xl font-semibold hover:text-pink-500"
              title={product.title}
            >
              {truncate(product.title, 50)}
            </h2>
          </Link>
          <div className="flex items-center mt-3">
            <Link to={`/products/${product.id}`}>
              <div className="flex items-center flex-wrap">
                <span className="text-gray-700 font-semibold">Price:</span>
                {product.discountPrice !== product.price && (
                  <span className="text-gray-700 ml-2 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-gray-800 font-bold ml-2 text-xl">
                  {formatPrice(product.discountPrice)}
                </span>
              </div>
            </Link>
            <button
              className="ml-auto bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-pink-600 min-h-12 min-w-fit"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <ModalImage
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={product.image}
      />
    </>
  );
};

export default ProductCard;
