export const randomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const calculateOriginalPrice = (
  price: number,
  discount: number
): number => {
  return price + (price * discount) / 100;
};

export const formatPrice = (price?: number): string => {
  if (!price) return '';
  return price.toFixed(2);
};

export const formatRating = (rate: number, count: number): string => {
  return `${rate.toFixed(1)} (${count} reviews)`;
};

export const titleCase = (str?: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
