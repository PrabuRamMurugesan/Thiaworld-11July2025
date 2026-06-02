import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from "react-icons/fa";

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(orderNumber || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber]);

  const fetchOrder = async (orderNum) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/orders/track/${orderNum}`
      );
      setOrder(response.data);
    } catch (error) {
      console.error(error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/order-tracking?orderNumber=${searchInput.trim()}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "confirmed":
        return <FaCheckCircle className="text-blue-500" />;
      case "processing":
        return <FaBox className="text-purple-500" />;
      case "shipped":
        return <FaTruck className="text-orange-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "returned":
        return <FaBox className="text-gray-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: "pending", label: "Order Placed" },
      { key: "confirmed", label: "Confirmed" },
      { key: "processing", label: "Processing" },
      { key: "shipped", label: "Shipped" },
      { key: "delivered", label: "Delivered" },
    ];

    if (!order) return steps;

    const currentIndex = steps.findIndex((step) => step.key === order.status);
    const adjustedIndex = order.status === "cancelled" ? -1 : currentIndex;

    return steps.map((step, index) => ({
      ...step,
      completed: index <= adjustedIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Track Your Order
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order Number (e.g., THIA-XXX-XXX)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#0B0B0B] text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Track
              </button>
            </div>
          </form>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4c542] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              {/* Order Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                    <span className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Tracking Number: {order.trackingNumber}
                    </p>
                    {order.shippingProvider && (
                      <p className="text-sm text-blue-600">
                        Provider: {order.shippingProvider}
                      </p>
                    )}
                  </div>
                )}

                {order.estimatedDelivery && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Progress */}
              {order.status !== "cancelled" && order.status !== "returned" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Order Progress
                  </h3>
                  <div className="relative">
                    {getStatusSteps().map((step, index) => (
                      <div key={step.key} className="flex items-center mb-4 last:mb-0">
                        <div className="flex flex-col items-center mr-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-green-500 text-white"
                                : step.current
                                ? "bg-[#f4c542] text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {step.completed ? (
                              <FaCheckCircle />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          {index < getStatusSteps().length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${
                                step.completed ? "bg-green-500" : "bg-gray-200"
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              step.current ? "text-[#f4c542]" : "text-gray-700"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.current && (
                            <p className="text-sm text-gray-500">
                              Current Status
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        {item.metalType && (
                          <p className="text-sm text-gray-600">{item.metalType}</p>
                        )}
                        {item.weight && (
                          <p className="text-sm text-gray-600">Weight: {item.weight}g</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-[#f4c542]">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Shipping Address
                </h3>
                <div className="text-gray-700">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.pincode}
                  </p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Status History */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Status History
                  </h3>
                  <div className="space-y-3">
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#f4c542] rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">
                            {history.status}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(history.timestamp).toLocaleString()}
                          </p>
                          {history.note && (
                            <p className="text-sm text-gray-500">{history.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!order && !loading && orderNumber && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Order Not Found
              </h3>
              <p className="text-gray-600">
                Please check your order number and try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderTrackingPage;
