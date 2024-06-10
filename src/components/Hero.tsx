interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  text: string;
  onClick: () => void;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  text,
  onClick,
}) => {
  return (
    <div
      className="m-6 relative flex items-center justify-center text-white text-center bg-cover bg-center bg-no-repeat h-96 rounded-lg overflow-hidden shadow-lg w-fit sm:w-3/4 lg:w-full"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl mb-6">{subtitle}</p>
        <button
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default Hero;
