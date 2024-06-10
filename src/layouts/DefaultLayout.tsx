import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

const DefaultLayout = () => {
  return (
    <div className="bg-slate-200">
      <Header />
      <div className="container mx-auto min-h-screen max-w-7xl">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
