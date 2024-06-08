export const randomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const calculateOriginalPrice = (
  price: number,
  discount: number
): number => {
  return price + (price * discount) / 100;
};
