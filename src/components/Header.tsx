import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 min-h-20 bg-slate-900 shadow-md">
      <div className="text-pink-300 italic font-bold text-4xl m-2">
        <Link to="/">
          <h1>
            Fake
            <span className="text-gray-300">Shop</span>
            <FaShoppingCart className="inline-block ml-2 text-3xl" />
          </h1>
        </Link>
        <p className="text-sm text-gray-300">
          A fake online store for shopping!
        </p>
      </div>
      <div className="text-gray-300 text-xl font-semibold flex-nowrap flex space-x-8 mx-4">
        <p>
          <Link to="/products">Products</Link>
        </p>
        <p>
          <Link to="/cart">Cart</Link>
        </p>
      </div>
    </header>
  );
};

export default Header;
