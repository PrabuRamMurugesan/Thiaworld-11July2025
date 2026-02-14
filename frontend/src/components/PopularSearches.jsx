import React from 'react';
import { Link } from 'react-router-dom';

const tags = [
  "Gold Necklace",
  "Diamond Ring",
  "22K Chains",
  "Antique Earrings",
  "Bridal Sets",
  "Kids Jewellery",
  "Temple Jewellery",
  "Dailywear Gold",
];

function makeLink(term) {
  return `/all-jewellery?search=${encodeURIComponent(term)}`;
}

const PopularSearches = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">🔎 Popular Searches</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <Link
            key={idx}
            to={makeLink(tag)}
            className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm rounded-full hover:bg-yellow-200 cursor-pointer transition"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
