import { FaPlus, FaMinus } from 'react-icons/fa';

interface QuantityPickerProps {
  quantity: number;
  setQuantity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityPicker = ({
  quantity,
  setQuantity,
  onIncrement,
  onDecrement,
}: QuantityPickerProps) => {
  return (
    <div className="flex items-center">
      <button
        className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400"
        onClick={onDecrement}
      >
        <FaMinus />
      </button>
      <input
        className="w-12 h-10 text-center border border-gray-400 rounded-lg mx-2"
        type="number"
        value={quantity}
        onChange={setQuantity}
        min={1}
      />
      <button
        className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400"
        onClick={onIncrement}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuantityPicker;
