// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-pink-700 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <Link
        to="/"
        className="rounded-md bg-pink-700 text-white px-4 py-2 hover:bg-pink-800"
      >
        Go to Home Page
      </Link>
      <div className="h-52"></div>
    </div>
  );
};

export default NotFoundPage;
