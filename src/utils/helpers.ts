export const formatPrice = (price?: number): string => {
  if (!price) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatRating = (rate: number, count: number): string => {
  return `${rate.toFixed(1)} (${count} reviews)`;
};

export const titleCase = (str?: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, maxLength: number): string => {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

export const limitWords = (str: string, limit: number): string => {
  const words = str.split(' ');
  if (words.length <= limit) return str;
  return words.slice(0, limit).join(' ') + '...';
};
