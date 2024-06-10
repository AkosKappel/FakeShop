import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

import { titleCase } from '../utils/helpers';
import { useCart } from '../hooks/CartHooks';

const Header = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const { cart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const api = process.env.API_URL;
        const response = await fetch(`${api}/products/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const activeLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'underline-effect text-pink-300 hover:text-pink-500 font-bold'
      : 'underline-effect text-gray-300 hover:text-pink-500 font-semibold';

  return (
    <header className="flex justify-between items-center p-4 min-h-20 bg-slate-900 shadow-md">
      <div className="text-pink-300 italic font-bold text-4xl m-2">
        <Link to="/">
          <h1>
            Fake
            <span className="text-gray-300">Shop</span>
            <FaShoppingCart className="inline-block ml-2 text-3xl" />
          </h1>
          <p className="text-sm text-gray-300">
            A fake online store for shopping!
          </p>
        </Link>
      </div>
      <div className="flex space-x-4 mx-4">
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
      <div className="text-gray-300 text-xl font-semibold flex-nowrap flex space-x-8 mx-4">
        <NavLink to="/products" className={activeLinkClass}>
          Products
        </NavLink>
        <NavLink to="/cart" className={activeLinkClass}>
          <FaShoppingCart className="inline-block ml-2 text-3xl" />
          {cart.totalQuantity > 0 && (
            <span className="ml-1 text-sm font-bold">
              ({cart.totalQuantity})
            </span>
          )}
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
