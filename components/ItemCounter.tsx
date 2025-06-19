
import React from 'react';
import { PlusIcon, MinusIcon } from '../constants';

interface ItemCounterProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

const ItemCounter: React.FC<ItemCounterProps> = ({ quantity, onIncrement, onDecrement, minQuantity = 0, maxQuantity = Infinity }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= minQuantity}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <MinusIcon className="w-4 h-4 text-gray-700" />
      </button>
      <span className="text-lg font-medium text-gray-800 w-8 text-center">{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= maxQuantity}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <PlusIcon className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
};

export default ItemCounter;
