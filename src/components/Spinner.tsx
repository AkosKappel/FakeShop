import { useEffect, useState } from 'react';

interface SpinnerProps {
  loading: boolean;
  description?: string;
}

const Spinner = ({ loading, description }: SpinnerProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] w-full">
      {loading && (
        <div className="size-24 animate-spin rounded-full border-8 border-gray-300 border-t-gray-900" />
      )}
      {description && (
        <div className="mt-4" style={{ minWidth: '140px' }}>
          <p>{`${description} ${dots}`}</p>
        </div>
      )}
    </div>
  );
};

export default Spinner;
