import { FaPlus, FaMinus } from 'react-icons/fa';

interface QuantityPickerProps {
  quantity: number;
  setQuantity?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  editable?: boolean;
}

const QuantityPicker = ({
  quantity,
  setQuantity = () => {},
  onIncrement,
  onDecrement,
  editable = false,
}: QuantityPickerProps) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onDecrement}
        className="rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-2"
      >
        <FaMinus />
      </button>
      {editable ? (
        <input
          type="number"
          value={quantity}
          className="w-10 h-8 text-center border border-gray-400 rounded-lg mx-2"
          onChange={setQuantity}
          min={1}
        />
      ) : (
        <span className="mx-4">{quantity}</span>
      )}
      <button
        onClick={onIncrement}
        className="rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-2"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuantityPicker;
