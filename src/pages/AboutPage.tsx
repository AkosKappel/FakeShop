import reactIcon from '../assets/react.svg';
import viteIcon from '../assets/vite.svg';
import tailwindIcon from '../assets/tailwind.svg';

const AboutPage = () => {
  return (
    <div className="m-8 flex items-center justify-center flex-col gap-3">
      <h1 className="text-4xl font-bold text-gray-800">About FakeShop</h1>
      <p className="text-lg text-gray-700 text-center">
        <a href="/">
          <i className="text-pink-500 font-semibold">FakeShop</i> is a mock
          online store built with{' '}
        </a>
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold inline-flex items-center gap-1"
        >
          React <img src={reactIcon} alt="React logo" className="w-6 h-6" />
        </a>
        ,{' '}
        <a
          href="https://vitejs.dev"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold inline-flex items-center gap-1"
        >
          Vite
          <img src={viteIcon} alt="Vite logo" className="w-6 h-6" />
        </a>
        , and{' '}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold inline-flex items-center gap-1"
        >
          Tailwind CSS
          <img src={tailwindIcon} alt="Tailwind CSS logo" className="w-6 h-6" />
        </a>
        .
      </p>
      <p className="text-lg text-gray-700 text-center">
        It is a simple frontend application showcasing online store with
        products that are fetched from a free and public{' '}
        <a
          href="https://fakestoreapi.com"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold"
        >
          Fake Store API
        </a>
        .
      </p>
      <p className="text-lg text-gray-700 text-center">
        Check out the source code on{' '}
        <a
          href="https://github.com/AkosKappel/FakeShop"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold"
        >
          GitHub
        </a>
      </p>
    </div>
  );
};

export default AboutPage;
