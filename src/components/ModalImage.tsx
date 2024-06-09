import { FaTimes } from 'react-icons/fa';

interface ModalImageProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ModalImage = ({ isOpen, onClose, imageUrl }: ModalImageProps) => {
  if (!isOpen) return null;

  const handleBackgroundClick = () => onClose();

  const handleContentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => event.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="relative" onClick={handleContentClick}>
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          <FaTimes className="text-gray-300 text-4xl" />
        </button>
        <img
          className="max-w-full max-h-screen border-white rounded-lg border-8"
          src={imageUrl}
          alt="Large view"
        />
      </div>
    </div>
  );
};

export default ModalImage;
