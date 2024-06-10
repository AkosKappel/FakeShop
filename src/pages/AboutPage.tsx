const AboutPage = () => {
  return (
    <div className="m-8 flex items-center justify-center flex-col gap-3">
      <h1 className="text-4xl font-bold text-gray-800">About FakeShop</h1>
      <p className="text-lg text-gray-700">
        <i className="text-pink-500 font-semibold">FakeShop</i> is a mock online
        store built with
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold"
        >
          {' '}
          React
        </a>
        ,{' '}
        <a
          href="https://vitejs.dev"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold"
        >
          Vite
        </a>
        , and{' '}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noreferrer"
          className="text-pink-500 font-semibold"
        >
          Tailwind CSS
        </a>
        .
      </p>
      <p className="text-lg text-gray-700">
        It is a simple online store for shopping. The products are fetched from
        a free{' '}
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
      <p className="text-lg text-gray-700">
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
