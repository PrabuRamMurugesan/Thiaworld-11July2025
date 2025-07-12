import React, { useState } from "react";
import axios from "axios";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  const handleTrackOrder = async () => {
    try {
      const response = await axios.get(
        `${API}/api/order/track?orderId=${orderId}&phone=${phone}`
      );
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Error tracking order", error);
      alert("Order not found!");
    }
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">📦 Track Your Order</h1>

      <input
        type="text"
        placeholder="Enter Order ID"
        className="border rounded p-2 my-2"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Phone Number"
        className="border rounded p-2 my-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        onClick={handleTrackOrder}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Track Order
      </button>

      {orderDetails && (
        <div className="mt-4">
          <h2 className="font-semibold">Order Details</h2>
          <p>Order ID: {orderDetails._id}</p>
          <p>Status: {orderDetails.status}</p>
          <p>Total Payable: ₹{orderDetails.grandTotal}</p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
