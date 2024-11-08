import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart, FaBars } from 'react-icons/fa';

import { titleCase } from '../utils/helpers';
import { useCart } from '../hooks/CartHooks';
import { formatPrice } from '../utils/helpers';
import { fetchCategories } from '../utils/dataFetch';

const Header = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false); // Close the menu if screen is large enough
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'flex nowrap items-center underline-effect text-pink-300 hover:text-pink-500 font-bold'
      : 'flex nowrap items-center underline-effect text-gray-300 hover:text-pink-500 font-semibold';

  return (
    <header className="flex justify-between items-center p-4 min-h-20 bg-slate-900 shadow-md">
      <div className="text-pink-300 italic font-bold text-4xl m-2">
        <Link to="/">
          <h1>
            Fake
            <span className="text-gray-300">Shop</span>
            <FaShoppingCart className="hidden sm:inline-block ml-2 text-3xl" />
          </h1>
          <p className="hidden sm:block text-sm text-gray-300">
            A fake online store for shopping!
          </p>
        </Link>
      </div>
      <div className="hidden lg:flex items-center space-x-4 mx-4">
        {categories.map((category) => (
          <NavLink
            key={category}
            to={`/products/category/${category}`}
            className={activeLinkClass}
          >
            {titleCase(category)}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-nowrap space-x-8 mx-4 text-gray-300 text-xl font-semibold">
        <div className="hidden md:flex flex-nowrap space-x-8">
          <NavLink to="/products" className={activeLinkClass}>
            Products
          </NavLink>
          <NavLink to="/about" className={activeLinkClass}>
            About
          </NavLink>
        </div>
        <div className="flex items-center space-x-8">
          <NavLink to="/cart" className={activeLinkClass}>
            <FaShoppingCart className="inline-block ml-2 text-3xl" />
            {cart.totalQuantity > 0 && (
              <div className="inline-block min-w-20 text-sm">
                <span className="ml-1 font-bold">
                  {formatPrice(cart.totalPrice)}
                </span>
                <span className="ml-1 font-bold">({cart.totalQuantity})</span>
              </div>
            )}
          </NavLink>
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 focus:outline-none"
            >
              <FaBars className="text-3xl" />
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-16 right-4 bg-slate-800 text-gray-300 rounded shadow-lg py-2 w-48 z-20"
        >
          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/products/category/${category}`}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 hover:bg-slate-700"
            >
              {titleCase(category)}
            </NavLink>
          ))}
          <NavLink
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 hover:bg-slate-700"
          >
            Products
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2 hover:bg-slate-700"
          >
            About
          </NavLink>
          <NavLink
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 hover:bg-slate-700 flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            {cart.totalQuantity > 0 && (
              <span className="ml-1 font-bold">
                {formatPrice(cart.totalPrice)} ({cart.totalQuantity})
              </span>
            )}
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
