import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductsPage from './ProductsPage';
import Carousel from '../components/Carousel';
import Spinner from '../components/Spinner';
import Hero from '../components/Hero';
import { Product } from '../types/Product.interface';
import heroBg from '../assets/hero-bg.jpg';
import { fetchProducts } from '../utils/dataFetch';

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestsellers = async (count: number) => {
      try {
        setLoading(true);
        const data = await fetchProducts(count);
        setBestSellers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers(10);
  }, []);

  useEffect(() => {
    // Select few random products as new arrivals
    setNewArrivals(
      bestSellers
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
    );
  }, [bestSellers]);

  return (
    <div>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="flex items-center justify-center flex-col">
          <Hero
            title="Welcome to FakeShop"
            subtitle="Explore our products and services."
            backgroundImage={heroBg}
            text="Learn More"
            onClick={() => navigate('/about')}
          />
          <div className="h-4" />
          <Carousel products={bestSellers} title="Best Sellers" />
          <div className="h-16" />
          <ProductsPage title="Recommended for You" numberOfProducts={4} />
          <Carousel products={newArrivals} title="New Arrivals" />
          <div className="h-16" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
