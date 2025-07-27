import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SecurePlanSection = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 rounded-lg bg-[#fff] shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Introducing the <span className="text-yellow-600">Thia Secure Plan</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Visual Flow */}
        <div>
          <img
            src="/assets/secure-plan-visual.png"
            alt="Thia Secure Plan Steps"
            className="w-full rounded shadow"
          />
        </div>

        {/* Explanation & CTA */}
        <div className="flex flex-col justify-center">
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <FaCheckCircle className="text-yellow-500 mt-1 mr-2" />
              Pay only <strong>40% upfront</strong> and reserve your jewelry
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-yellow-500 mt-1 mr-2" />
              We pledge the product in your name at your preferred bank
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-yellow-500 mt-1 mr-2" />
              Pay the remaining <strong>60% in 12 months via Golldex</strong> — no interest
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-yellow-500 mt-1 mr-2" />
              <strong>We pay the interest</strong> to the bank on your behalf
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-yellow-500 mt-1 mr-2" />
              Product delivered to your doorstep with <strong>BIS Certificate</strong>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded shadow">
              Apply Now
            </button>
            <button className="bg-white text-yellow-600 hover:text-yellow-700 border border-yellow-500 font-medium px-6 py-2 rounded shadow">
              Know More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePlanSection;