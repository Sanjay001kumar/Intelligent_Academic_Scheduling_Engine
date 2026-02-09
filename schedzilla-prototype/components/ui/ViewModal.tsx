import React from 'react';

type ViewModalProps<T> = {
  item: T | null;
  onClose: () => void;
  renderDetails: (item: T) => React.ReactNode;
};

export default function ViewModal<T>({ item, onClose, renderDetails }: ViewModalProps<T>) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-[#141820] text-white p-6 rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {renderDetails(item)}
        <button
          onClick={onClose}
          className="mt-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
