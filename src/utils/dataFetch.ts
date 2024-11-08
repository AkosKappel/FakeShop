import { murmur2 } from 'murmurhash-js';

import { Product } from '../types/Product.interface';

const MAX_UINT_32 = 4_294_967_295;
const DISCOUNT_PROBABILITY = 0.25;
const MIN_DISCOUNT = 10;
const MAX_DISCOUNT = 50;

const randomInteger = (
  min: number,
  max: number,
  seed: number | string
): number =>
  Math.round(
    Math.floor((murmur2(String(seed), MAX_UINT_32) % (max - min + 1)) + min)
  );

const calculateDiscountPrice = (price: number, discount: number): number =>
  price * (1 - discount / 100);

const addDiscount = (product: Product, seed: string) => {
  const probability = murmur2(product.title + seed) / MAX_UINT_32;

  if (probability < DISCOUNT_PROBABILITY) {
    const discount = randomInteger(MIN_DISCOUNT, MAX_DISCOUNT, seed);
    product.discountPrice = calculateDiscountPrice(product.price, discount);
  } else {
    product.discountPrice = product.price;
  }
};

export const fetchProducts = async (
  count: number,
  category?: string
): Promise<Product[]> => {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error('API_URL is not defined');
  }

  const url =
    `${baseUrl}/products` +
    (category ? `/category/${category}` : '') +
    `?limit=${count}`;

  const response = await fetch(url);
  const data = await response.json();

  // Simulate a discount on a daily basis
  const today = new Date().toISOString().slice(0, 10);
  data.forEach((product: Product) => addDiscount(product, today));

  return data;
};

export const fetchProduct = async (id?: string) => {
  if (!id) return;

  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error('API_URL is not defined');
  }

  const url = `${baseUrl}/products/${id}`;
  const response = await fetch(url);
  const data = await response.json();

  // Calculate discount
  const today = new Date().toISOString().slice(0, 10);
  addDiscount(data, today);

  return data;
};

export const fetchCategories = async () => {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error('API_URL is not defined');
  }

  const url = `${baseUrl}/products/categories`;
  const response = await fetch(url);
  const data = await response.json();

  return data;
};
