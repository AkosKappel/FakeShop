import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ModalImage from './ModalImage';
import { Product } from '../types/Product.interface';
import { randomNumber, calculateOriginalPrice } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Simulate a discount between 10% and 35% on 30% of products
  const [fullPrice, setFullPrice] = useState<number>(
    calculateOriginalPrice(
      product.price,
      Math.random() < 0.3 ? Math.round(randomNumber(10, 35)) : 0
    )
  );

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = () => {
    // TODO: Add product to cart
    console.log('Product added to cart:', product);
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
          <h2 className="text-gray-800 text-2xl font-semibold hover:text-pink-500">
            <Link to={`/products/${product.id}`}>{product.title}</Link>
          </h2>
          <div className="flex items-center mt-2">
            <span className="text-gray-700 font-semibold">Price:</span>
            {fullPrice !== product.price && (
              <span className="text-gray-700 ml-2 line-through">
                ${fullPrice.toFixed(2)}
              </span>
            )}
            <span className="text-gray-800 font-bold ml-2 text-xl">
              ${product.price.toFixed(2)}
            </span>
            <button
              className="ml-auto bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-pink-600"
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
