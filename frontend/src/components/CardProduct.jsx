import React from "react";

const CardProduct = ({ product }) => {
  return (
    <div className="border p-4 rounded shadow-md">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 font-bold">{product.name}</h3>
      <p>
        {product.metalType} - {product.metalColor}
      </p>
      <p>
        Net: {product.netWeight}g | Gross: {product.grossWeight}g
      </p>
      <p>₹{product.price}</p>
      {product.discount > 0 && (
        <p className="line-through text-gray-400">
          ₹{Math.round(product.price / (1 - product.discount / 100))}
        </p>
      )}
      {product.isSecurePlanEnabled && (
        <span className="text-green-600">Secure Plan</span>
      )}
      {product.isPartialPaymentEnabled && (
        <span className="text-yellow-500">Partial Pay</span>
      )}
      {product.isCombo && <span className="text-purple-500">Combo</span>}
      <button className="mt-2 bg-yellow-500 px-3 py-1 rounded text-white">
        Add to Cart
      </button>
    </div>
  );
};

export default CardProduct;
