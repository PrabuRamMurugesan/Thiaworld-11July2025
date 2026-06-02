import React, { useState } from "react";
import { FaCreditCard, FaUniversity, FaMobileAlt, FaWallet, FaCcStripe, FaCcPaypal, FaGooglePay, FaApplePay } from "react-icons/fa";

const PaymentOptions = ({ onPaymentSelect, selectedPayment, amount }) => {
  const [selectedOption, setSelectedOption] = useState(selectedPayment || "razorpay");

  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      icon: <FaMobileAlt className="text-blue-600" />,
      description: "Pay securely with Razorpay",
      popular: true
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <FaCreditCard className="text-purple-600" />,
      description: "Visa, Mastercard, RuPay"
    },
    {
      id: "upi",
      name: "UPI",
      icon: <FaMobileAlt className="text-green-600" />,
      description: "Google Pay, PhonePe, Paytm"
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: <FaUniversity className="text-orange-600" />,
      description: "All major banks supported"
    },
    {
      id: "wallet",
      name: "Wallet",
      icon: <FaWallet className="text-pink-600" />,
      description: "Paytm Wallet, Amazon Pay"
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: <FaCcStripe className="text-indigo-600" />,
      description: "International cards"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <FaCcPaypal className="text-blue-500" />,
      description: "Pay with PayPal"
    },
    {
      id: "gpay",
      name: "Google Pay",
      icon: <FaGooglePay className="text-blue-500" />,
      description: "Fast checkout with GPay"
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: <FaApplePay className="text-gray-800" />,
      description: "Quick Apple Pay checkout"
    }
  ];

  const handleSelect = (methodId) => {
    setSelectedOption(methodId);
    if (onPaymentSelect) {
      onPaymentSelect(methodId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
              selectedOption === method.id
                ? "border-[#f4c542] bg-[#f4c542]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl">{method.icon}</div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{method.name}</p>
                {method.popular && (
                  <span className="px-2 py-0.5 bg-[#f4c542] text-white text-xs rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedOption === method.id
                ? "border-[#f4c542] bg-[#f4c542]"
                : "border-gray-300"
            }`}>
              {selectedOption === method.id && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* EMI Option */}
      {amount >= 5000 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-[#f4c542] to-[#caa43b] rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">No Cost EMI Available</p>
              <p className="text-sm opacity-90">Pay in easy installments</p>
            </div>
            <button className="px-4 py-2 bg-white text-[#0B0B0B] rounded-lg font-medium hover:bg-gray-100 transition-colors">
              View Plans
            </button>
          </div>
        </div>
      )}

      {/* Security Note */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-600">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentOptions;
