import { LuHeart } from 'react-icons/lu';

import { toggleWishlist, useWishlist } from '../lib/lists';
import { toast } from '../lib/toast';

interface WishlistButtonProps {
  productId: number;
  title: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  title,
  className = 'btn-icon',
}: WishlistButtonProps) {
  const saved = useWishlist().includes(productId);

  const handleClick = () => {
    const added = toggleWishlist(productId);
    toast(added ? 'Saved to your wishlist' : 'Removed from your wishlist', {
      label: 'View wishlist',
      to: '/wishlist',
    });
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={`Save ${title} to wishlist`}
      title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <LuHeart
        className={`size-5 ${saved ? 'fill-brand-600 text-brand-600' : ''}`}
      />
    </button>
  );
}
