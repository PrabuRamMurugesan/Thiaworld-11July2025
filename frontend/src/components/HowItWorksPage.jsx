import React from 'react';
import { FaShieldAlt, FaMobileAlt, FaCreditCard, FaTruck, FaWhatsapp, FaQuestionCircle, FaCalendarAlt } from 'react-icons/fa';

const HowItWorksPage = () => {
  return (
    <div className="text-gray-800 bg-white">

      {/* Hero Section */}
      <section className="bg-yellow-50 py-12 text-center px-4">
        <h1 className="text-3xl font-bold mb-2">How It Works</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the complete journey of your gold purchase – from selection to secure doorstep delivery, powered by Thia Secure Plan + Golldex.
        </p>
      </section>

      {/* Step-by-Step Timeline */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">The 6-Step Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            "You Select Jewelry",
            "Pay Just 40%",
            "We Pledge in Your Name",
            "Golldex Pays the Rest",
            "You Pay Monthly EMIs",
            "We Unpledge & Deliver",
          ].map((step, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition">
              <div className="text-3xl font-bold text-yellow-500 mb-2">{i + 1}</div>
              <h3 className="font-semibold text-lg">{step}</h3>
              <p className="text-sm mt-2">
                {[
                  "Choose BIS-certified jewelry from our collection.",
                  "Pay 40% upfront to lock-in your piece.",
                  "Your jewelry is pledged with your bank (digitally).",
                  "Golldex pays the remaining 60% to complete your purchase.",
                  "You repay via Golldex app with zero interest.",
                  "After payment, we unpledge & deliver your jewelry safely.",
                ][i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Explainers Section */}
      <section className="bg-gray-50 py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">What Makes It Possible?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {[
            [<FaShieldAlt />, "Gold Security", "Your gold is BIS-certified and pledged with top banks."],
            [<FaCreditCard />, "Golldex EMI", "0% interest monthly EMI handled through Golldex."],
            [<FaTruck />, "Doorstep Delivery", "After full repayment, we unpledge and ship to you."],
            [<FaMobileAlt />, "Track via App", "Real-time tracking via Golldex or Thiaworld app."],
          ].map(([icon, title, desc], i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <div className="text-yellow-500 text-3xl mb-2">{icon}</div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Embed Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Watch How It Works</h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-64 rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/MwYzEXwkjkE"
            title="How Thia Secure Plan Works"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Summary Table */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Process Summary Snapshot</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-center">
            <thead>
              <tr className="bg-yellow-100">
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Handled By</th>
                <th className="p-2 border">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Jewelry Selection", "Customer", "Day 0"],
                ["Initial Payment (40%)", "Customer", "Day 0"],
                ["Pledging Process", "Thia & Partner Bank", "Day 1-2"],
                ["Balance Payment", "Golldex", "Day 2"],
                ["EMI Repayment", "Customer → Golldex", "Monthly (12 Months)"],
                ["Delivery", "Thiaworld", "After EMI completion"],
              ].map(([action, who, when], i) => (
                <tr key={i}>
                  <td className="p-2 border">{action}</td>
                  <td className="p-2 border">{who}</td>
                  <td className="p-2 border">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Support CTA Section */}
      <section className="bg-yellow-50 py-10 px-6 text-center">
        <h3 className="text-xl font-semibold mb-3">Still Have Questions?</h3>
        <p className="mb-6">Reach out to our support team or read the FAQs.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/919999999999" target="_blank" className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 flex items-center gap-2">
            <FaWhatsapp /> Chat on WhatsApp
          </a>
          <a href="/faqs" className="bg-white border border-yellow-600 text-yellow-600 px-5 py-2 rounded hover:bg-yellow-600 hover:text-white flex items-center gap-2">
            <FaQuestionCircle /> FAQs
          </a>
          <a href="/book-appointment" className="bg-yellow-600 text-white px-5 py-2 rounded hover:bg-yellow-700 flex items-center gap-2">
            <FaCalendarAlt /> Book Appointment
          </a>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50"
      >
        <FaWhatsapp /> Chat
      </a>

      {/* Spacer */}
      <div className="h-10"></div>
    </div>
  );
};

export default HowItWorksPage;
