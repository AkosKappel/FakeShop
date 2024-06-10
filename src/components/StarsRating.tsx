import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { formatRating } from '../utils/helpers';

interface StarsRatingProps {
  rating: number;
  reviewCount: number;
  maxStars?: number;
}

const StarsRating = ({
  rating,
  reviewCount,
  maxStars = 5,
}: StarsRatingProps) => {
  return (
    <div className="flex items-center">
      <div className="flex text-yellow-400">
        {Array.from({ length: maxStars }, (_, index) => index + 1).map(
          (star) => (
            <span key={star}>
              {rating >= star ? (
                <FaStar />
              ) : rating >= star - 0.5 ? (
                <FaStarHalfAlt />
              ) : (
                <FaStar className="text-gray-300" />
              )}
            </span>
          )
        )}
      </div>
      <span className="text-gray-600 ml-2">
        {formatRating(rating, reviewCount)}
      </span>
    </div>
  );
};

export default StarsRating;
