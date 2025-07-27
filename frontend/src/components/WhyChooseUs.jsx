import React from 'react';
import { FaCertificate, FaLock, FaMoneyCheckAlt, FaTruck } from 'react-icons/fa';

const benefits = [
  {
    icon: <FaCertificate className="text-yellow-500 text-3xl mb-2" />,
    title: 'BIS Certified Gold',
    description: 'Every product is BIS Hallmarked for purity and quality assurance.',
  },
  {
    icon: <FaLock className="text-yellow-500 text-3xl mb-2" />,
    title: 'Bank-Pledged Security',
    description: 'Jewelry is pledged in your name at your preferred bank to ensure safety.',
  },
  {
    icon: <FaMoneyCheckAlt className="text-yellow-500 text-3xl mb-2" />,
    title: 'Transparent Pricing',
    description: '100% clarity in gold pricing, weight, and plan terms — no hidden charges.',
  },
  {
    icon: <FaTruck className="text-yellow-500 text-3xl mb-2" />,
    title: 'Safe Insured Delivery',
    description: 'Insured doorstep delivery with tamper-proof packaging.',
  },
];

const WhyChooseUs = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12 text-center bg-[#fdfaf6] rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-8">Why Choose <span className="text-yellow-600">Thiaworld?</span></h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center px-4">
            {benefit.icon}
            <h3 className="text-md font-medium text-gray-800 mb-1">{benefit.title}</h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;