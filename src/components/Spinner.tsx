import ClipLoader from 'react-spinners/ClipLoader';
import { useEffect, useState } from 'react';

const Spinner = ({ loading = true, description = '' }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-1/2-screen w-full">
      <ClipLoader color="#000" loading={loading} size={150} />
      {description && (
        <div className="mt-4" style={{ minWidth: '140px' }}>
          <p>{`${description} ${dots}`}</p>
        </div>
      )}
    </div>
  );
};

export default Spinner;
