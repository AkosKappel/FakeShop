import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import { Product } from '../types/Product.interface';
import { limitWords, formatPrice } from '../utils/helpers';

interface CarouselProps {
  title?: string;
  products: Product[];
  itemsPerView?: 2 | 3 | 4 | 5 | 6;
  jumpSize?: number;
  interval?: number;
}

const Carousel = ({
  title,
  products,
  itemsPerView = 3,
  jumpSize = 1,
  interval = 5000,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + jumpSize) % (products.length - itemsPerView + 1)
      );
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, products.length, jumpSize, itemsPerView, interval]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - itemsPerView : prevIndex - jumpSize
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= products.length - itemsPerView ? 0 : prevIndex + jumpSize
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-4">
      {title && (
        <h2 className="text-3xl font-semibold text-center my-3">{title}</h2>
      )}
      <div className="overflow-hidden relative lg:h-64">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 p-2"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="bg-white shadow-md rounded-lg flex flex-col justify-between h-full">
                <div className="flex justify-center items-center m-3 relative">
                  <img
                    className="h-32 w-32 object-contain object-center"
                    src={product.image}
                    alt={product.title}
                    title={product.title}
                  />
                </div>
                <Link to={`/products/${product.id}`}>
                  <div className="flex flex-col md:flex-row justify-between items-center p-4">
                    <h3 className="text-gray-800 text-xl font-semibold hover:text-pink-600">
                      {limitWords(product.title, 4)}
                    </h3>
                    <p className="text-gray-600 text-lg m-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {products.length > itemsPerView && (
        <button
          onClick={handlePrevClick}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-slate-900 text-white p-3 rounded-full focus:outline-none hover:bg-pink-600"
        >
          <FaArrowLeft />
        </button>
      )}
      {products.length > itemsPerView && (
        <button
          onClick={handleNextClick}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-slate-900 text-white p-3 rounded-full focus:outline-none hover:bg-pink-600"
        >
          <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default Carousel;
