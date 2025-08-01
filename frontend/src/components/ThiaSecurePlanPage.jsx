// src/pages/ThiaSecurePlanPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const ThiaSecurePlanPage = () => {
  useEffect(() => {
    document.title = "Thia Secure Plan | 40% Gold Booking & 0% Interest";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    preferredPlan: "",
    message: "",
    totalPrice: "",
    downPayment: "",
    tenureMonths: "",
    interestRate: "",
  });
  const [monthlyEMI, setMonthlyEMI] = useState(null);
  const [totalPayable, setTotalPayable] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/secureplan/submit`, {
        ...formData,
        monthlyInstallment: monthlyEMI,
      });

      if (response.status === 200) {
        alert("✅ Your interest has been recorded successfully.");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          preferredPlan: "",
          message: "",
          totalPrice: "",
          downPayment: "",
          tenureMonths: "",
          interestRate: "",
        });
        setMonthlyEMI(null);
        setTotalPayable(null);
        setTotalInterest(null);
      } else {
        alert("❌ Something went wrong: " + response.data.error);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("❌ Server error. Please try again later.");
    }
  };

  useEffect(() => {
    const { totalPrice, downPayment, tenureMonths, interestRate } = formData;

    if (
      totalPrice && downPayment && tenureMonths &&
      interestRate && Number(totalPrice) > Number(downPayment) && Number(tenureMonths) > 0
    ) {
      const P = Number(totalPrice) - Number(downPayment);
      const R = Number(interestRate) / 12 / 100;
      const N = Number(tenureMonths);

      const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      const total = emi * N;
      const interest = total - P;

      setMonthlyEMI(emi.toFixed(2));
      setTotalPayable(total.toFixed(2));
      setTotalInterest(interest.toFixed(2));
    } else {
      setMonthlyEMI(null);
      setTotalPayable(null);
      setTotalInterest(null);
    }
  }, [formData]);

  useEffect(() => {
    if (monthlyEMI && totalPayable && totalInterest) {
      localStorage.setItem("latestEMIPreview", JSON.stringify({
        monthlyEMI,
        totalPayable,
        totalInterest,
        formData
      }));
    }
  }, [monthlyEMI, totalPayable, totalInterest]);

  return (
    <>
      <Header />
      <div className="p-6 m-4 mx-auto border rounded-lg shadow-lg bg-white">

        {/* Hero Section */}
        <section id="hero" className="text-center mb-10">
          <h1 className="text-3xl font-bold text-yellow-600 mb-2">Thia Secure Plan</h1>
          <p className="text-gray-600">Own your dream gold with just 40% upfront. No interest. No hassle.</p>
          <div className="mt-4 space-x-4">
            <a href="#steps" className="text-blue-600 underline">📌 View Steps</a>
            <a href="#faqs" className="text-blue-600 underline">📌 View FAQs</a>
          </div>
        </section>

        {/* Step by Step */}
        <section id="steps" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[...Array(6)].map((_, step) => (
            <div key={step} className="p-4 bg-white shadow rounded border border-yellow-100 transition-transform hover:scale-105 duration-300">
              <h3 className="font-semibold text-lg mb-2">Step {step + 1}</h3>
              <img src={`/assets/step${step + 1}.png`} alt={`Step ${step + 1}`} className="mb-2 mx-auto h-24" />
              <p className="text-sm text-gray-500">Description for step {step + 1} of the Secure Plan goes here.</p>
            </div>
          ))}
        </section>

        {/* Benefits */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {['Bank Security', '0% Interest', '100% BIS Hallmark', 'Easy Redemption', 'No Hidden Charges', 'Trusted Process'].map((benefit, index) => (
            <div key={index} className="bg-yellow-50 p-4 border rounded shadow">
              <h4 className="text-md font-bold text-yellow-700">✅ {benefit}</h4>
            </div>
          ))}
        </section>

        {/* Compare Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-center text-yellow-700 mb-4">📊 Compare Secure Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Plan A – 40% Upfront",
                totalPrice: 60000,
                downPayment: 24000,
                tenure: 12,
                rate: 8,
              },
              {
                title: "Plan B – 50% Upfront",
                totalPrice: 60000,
                downPayment: 30000,
                tenure: 10,
                rate: 8,
              },
              {
                title: "Plan C – 60% Upfront",
                totalPrice: 60000,
                downPayment: 36000,
                tenure: 9,
                rate: 8,
              },
            ].map((plan, index) => {
              const P = plan.totalPrice - plan.downPayment;
              const R = plan.rate / 12 / 100;
              const N = plan.tenure;
              const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
              const total = emi * N;
              const interest = total - P;

              return (
                <div key={index} className="border rounded-xl p-4 shadow-md bg-white hover:shadow-xl transition duration-300">
                  <h3 className="font-bold text-lg text-yellow-700 mb-2">{plan.title}</h3>
                  <p>🪙 Total Price: ₹{plan.totalPrice}</p>
                  <p>💰 Down Payment: ₹{plan.downPayment}</p>
                  <p>📆 Tenure: {plan.tenure} months</p>
                  <p>📈 Interest Rate: {plan.rate}%</p>
                  <hr className="my-2" />
                  <p className="text-green-700">Monthly EMI: ₹{emi.toFixed(2)}</p>
                  <p>Total Interest: ₹{interest.toFixed(2)}</p>
                  <p>Total Payable: ₹{total.toFixed(2)}</p>
                  <button
                    onClick={() => {
                      axios.post(`${import.meta.env.VITE_API_URI}/compareplan/save`, {
                        planTitle: plan.title,
                        totalPrice: plan.totalPrice,
                        downPayment: plan.downPayment,
                        tenure: plan.tenure,
                        interestRate: plan.rate,
                        monthlyEMI: emi.toFixed(2),
                        totalPayable: total.toFixed(2),
                        totalInterest: interest.toFixed(2),
                      });
                    }}
                    className="text-xs text-blue-600 underline mt-2"
                  >
                    Log this plan
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ USAGE SECTION — COMING SOON */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-yellow-700">🧩 Coming Soon – Additional Uses of THIA Secure Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-800">
            <div className="p-4 bg-yellow-50 border rounded shadow">📦 Used in: Gold Jewelry Product Purchase with 0% EMI</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">🏦 Integration: Linked with RBI Bank Pledge APIs</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">📊 Dynamic EMI Estimator connected to Checkout Page</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">📂 Auto-Save Plan to LocalStorage for Pre-Checkout</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">💬 Used for Smart Recommendations in Product Comparison</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">🔗 Shareable Link to EMI Preview with WhatsApp Support</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">📁 Eligibility Used in Return & Refund Approval Flow</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">🔐 Integrated with KYC Verification & Gold Locker Plans</div>
            <div className="p-4 bg-yellow-50 border rounded shadow">📈 Future: Auto Convert Plan into Monthly SIP Model</div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="mb-10 overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-yellow-100">
              <tr>
                <th className="border p-2">Feature</th>
                <th className="border p-2">Regular Gold Purchase</th>
                <th className="border p-2">Thia Secure Plan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Upfront Payment</td>
                <td className="border p-2">100%</td>
                <td className="border p-2">40%</td>
              </tr>
              <tr>
                <td className="border p-2">Interest</td>
                <td className="border p-2">Yes</td>
                <td className="border p-2">No</td>
              </tr>
              <tr>
                <td className="border p-2">Flexibility</td>
                <td className="border p-2">Limited</td>
                <td className="border p-2">High</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* EMI Estimator */}
        <section id="emi" className="mb-10">
          <h2 className="text-xl font-bold mb-4">Estimate Your Gold Plan</h2>
          <p className="text-sm text-gray-500 mb-2">Use this quick calculator to check your EMI with Golldex Wallet</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input type="number" name="totalPrice" value={formData.totalPrice} onChange={handleInputChange} placeholder="Total Product Price (₹)" className="w-full p-2 border rounded" />
            <input type="number" name="downPayment" value={formData.downPayment} onChange={handleInputChange} placeholder="Down Payment (₹)" className="w-full p-2 border rounded" />
            <input type="number" name="tenureMonths" value={formData.tenureMonths} onChange={handleInputChange} placeholder="Tenure (in Months)" className="w-full p-2 border rounded" />
            <input type="number" name="interestRate" value={formData.interestRate} onChange={handleInputChange} placeholder="Interest Rate (Annual %)" className="w-full p-2 border rounded" />
          </div>
          {monthlyEMI && (
            <div className="rounded-xl p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 shadow-lg text-yellow-800 mb-6">
              <h3 className="text-xl font-bold mb-2">🧮 EMI Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded shadow text-center">
                  <p className="text-sm text-gray-500">Monthly EMI</p>
                  <p className="text-lg font-bold text-green-600">₹{monthlyEMI}</p>
                </div>
                <div className="p-3 bg-white rounded shadow text-center">
                  <p className="text-sm text-gray-500">Total Interest</p>
                  <p className="text-lg font-bold text-red-500">₹{totalInterest}</p>
                </div>
                <div className="p-3 bg-white rounded shadow text-center">
                  <p className="text-sm text-gray-500">Total Payable</p>
                  <p className="text-lg font-bold text-blue-600">₹{totalPayable}</p>
                </div>
              </div>
            </div>
          )}
          {monthlyEMI && (
            <div className="text-center mt-6">
              <p className="mb-2 text-sm text-gray-600">Need help choosing a plan?</p>
              <a
                href="https://wa.me/919600729596?text=Hi! I want help choosing a gold plan from Thia Secure Plan."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
              >
                📞 Schedule a Call on WhatsApp
              </a>
            </div>
          )}
        </section>

        {/* FAQs */}
        <section id="faqs" className="mb-10">
          <h2 className="text-xl font-bold mb-4">FAQs</h2>
          {["Can I exit early?", "Is interest charged?", "Who pays the balance?", "Is my gold safe in bank?"].map((faq, idx) => (
            <details key={idx} className="mb-2 border rounded p-3">
              <summary className="font-semibold cursor-pointer">{faq}</summary>
              <p className="text-sm text-gray-600 mt-2">Answer for "{faq}" goes here.</p>
            </details>
          ))}
        </section>

        {/* Interest Form */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Submit Your Interest</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="p-2 border rounded" required />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-2 border rounded" required />
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" className="p-2 border rounded" required />
            <select name="preferredPlan" value={formData.preferredPlan} onChange={handleInputChange} className="p-2 border rounded">
              <option value="">Preferred Plan</option>
              <option value="Gold">Gold</option>
              <option value="Combo">Gold + Secure Plan</option>
            </select>
            <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Message (Optional)" className="p-2 border rounded md:col-span-2"></textarea>
            <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 md:col-span-2 hover:bg-yellow-600">Submit</button>
          </form>
        </section>

        {/* Legal */}
        <section className="mb-10">
          <details className="border rounded p-3">
            <summary className="font-semibold">🔐 Legal & Compliance Information</summary>
            <p className="text-sm text-gray-600 mt-2">Our plans comply with RBI and SEBI norms for consumer gold pledging. Golldex is regulated and works with RBI-approved banks only.</p>
          </details>
        </section>

        {/* Footer Links */}
        <section className="text-center mt-10">
          <a href="/book-appointment" className="text-yellow-600 underline font-semibold">📅 Book an Appointment</a>
          <span className="mx-4">|</span>
          <a href="https://wa.me/919999999999" className="text-green-600 underline font-semibold">📱 WhatsApp Us</a>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default ThiaSecurePlanPage;
