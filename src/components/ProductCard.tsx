import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product.interface';
import { randomNumber, calculateOriginalPrice } from '../utils/helpers';

const ProductCard = ({ product }: { product: Product }) => {
  // Simulate a discount between 10% and 35% on 30% of products
  const [originalPrice, setOriginalPrice] = useState<number>(
    calculateOriginalPrice(
      product.price,
      Math.random() < 0.3 ? Math.round(randomNumber(10, 35)) : 0
    )
  );

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg flex flex-col justify-between">
        <div className="flex justify-center items-center m-3">
          <img
            className="h-64 w-64 object-contain object-center"
            src={product.image}
            alt={product.title}
            title={product.title}
          />
        </div>
        <div className="p-4">
          <h2 className="text-gray-800 text-2xl font-semibold">
            <Link to={`/products/${product.id}`}>{product.title}</Link>
          </h2>
          <div className="flex items-center mt-2">
            <span className="text-gray-700 font-semibold">Price:</span>
            {originalPrice !== product.price && (
              <span className="text-gray-800 ml-2 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-gray-800 font-bold ml-2">
              ${product.price.toFixed(2)}
            </span>
            <button className="ml-auto bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-pink-700">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
