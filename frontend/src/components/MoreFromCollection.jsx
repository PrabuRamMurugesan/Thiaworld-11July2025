
import React from 'react';
import { Link } from 'react-router-dom';
import { buildImgSrc, normalizeImages } from "../utils/imageTools";

const MoreFromCollection = ({ items = [] }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <h3 className="text-xl font-semibold mb-4">🌀 More from this Collection</h3>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No additional items in this collection.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {items.map((item, idx) => {
            // choose the first image; normalizePaths
            const imgs = normalizeImages(item.images || []);
            const src = imgs.length ? buildImgSrc(imgs[0]) : "/default-product.jpg";
            return (
              <Link
                to={`/product/${item._id}`}
                key={item._id || idx}
                className="min-w-[200px] bg-white shadow-md rounded-md overflow-hidden border hover:shadow-lg transition"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src={src} alt={item.name} className="h-48 w-full object-cover" />
                <div className="p-3">
                  <h4 className="text-sm font-bold text-gray-700">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.category}</p>
                  <p className="text-yellow-600 font-semibold text-sm">
                    ₹{Number(item.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoreFromCollection;
