
import React from 'react';

const MoreFromCollection = ({ items = [] }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <h3 className="text-xl font-semibold mb-4">🌀 More from this Collection</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="min-w-[200px] bg-white shadow-md rounded-md overflow-hidden border hover:shadow-lg transition"
          >
            <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
            <div className="p-3">
              <h4 className="text-sm font-bold text-gray-700">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.category}</p>
              <p className="text-yellow-600 font-semibold text-sm">₹{item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreFromCollection;
