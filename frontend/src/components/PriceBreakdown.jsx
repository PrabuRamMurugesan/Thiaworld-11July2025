
import React from 'react';

const PriceBreakdown = ({ priceDetails }) => {
  if (!priceDetails || !priceDetails.components) {
    return <div className="text-sm text-red-600 p-4">Price details not available.</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10">
      <h3 className="text-xl font-semibold mb-4">💰 Price Breakup</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-yellow-100">
            <tr>
              <th className="border p-2">Component</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Weight</th>
              <th className="border p-2">Value</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Final Value</th>
            </tr>
          </thead>
          <tbody>
            {priceDetails.components.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.rate}</td>
                <td className="border p-2">{item.weight}</td>
                <td className="border p-2">₹{item.value}</td>
                <td className="border p-2">{item.discount || '-'}</td>
                <td className="border p-2">₹{item.finalValue}</td>
              </tr>
            ))}
            <tr className="bg-yellow-50 font-semibold">
              <td className="border p-2" colSpan="5">Total</td>
              <td className="border p-2">₹{priceDetails.total}</td>
            </tr>
            <tr>
              <td className="border p-2" colSpan="5">GST (3%)</td>
              <td className="border p-2">₹{priceDetails.gst}</td>
            </tr>
            <tr className="bg-yellow-100 font-bold">
              <td className="border p-2" colSpan="5">Grand Total</td>
              <td className="border p-2 text-green-700">₹{priceDetails.grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceBreakdown;
