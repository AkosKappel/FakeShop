import { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import Spinner from '../components/Spinner';
import Hero from '../components/Hero';
import ProductsPage from './ProductsPage';
import { Product } from '../types/Product.interface';

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const api = process.env.API_URL;
        const response = await fetch(`${api}/products?limit=10`);
        const data = await response.json();
        setBestSellers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const handleCtaClick = () => {
    console.log('CTA Clicked!'); // TODO: Add about page
  };

  return (
    <div className="flex items-center justify-center flex-col">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div>
          <Hero
            title="Welcome to FakeShop"
            subtitle="Explore our products and services."
            backgroundImage="https://t3.ftcdn.net/jpg/02/84/32/52/360_F_284325273_ei2pxwlAyg4ghLOBINFPiF1LVubbfLpA.jpg"
            ctaText="Learn More"
            onCtaClick={handleCtaClick}
          />
          <div className="h-4" />
          <Carousel products={bestSellers} title="Best Sellers" />
          <div className="h-8" />
          <ProductsPage title="Recommended for You" numberOfProducts={4} />
          <div className="h-8" />
          <Carousel products={newArrivals} title="New Arrivals" />
          <div className="h-16" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
