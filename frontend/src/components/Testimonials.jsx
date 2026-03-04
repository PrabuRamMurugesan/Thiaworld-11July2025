import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

const TestimonialsPage = () => {

  const [testimonials, setTestimonials] = useState([]);
useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/testimonials`
      );

      console.log("Testimonials API full response:", res);
      console.log("Testimonials API data:", res.data);

      const data =
        res.data?.items ||
        res.data?.testimonials ||
        res.data?.data ||
        res.data ||
        [];

      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setTestimonials([]);
    }
  };

  fetchTestimonials();
}, []);

  return (
    <div className="bg-white text-gray-800 px-4 py-10 max-w-6xl mx-auto">

      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold">Customer Testimonials</h1>
        <p className="text-gray-600 mt-2">
          Hear what our happy customers say about Thiaworld and Golldex Secure Plan
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
  {Array.isArray(testimonials) &&
  testimonials.slice(0,6).map((t) => (
    <div key={t._id}>
            <img
              src={
                t.image
                  ? `${import.meta.env.VITE_API_URL}${t.image}`
                  : "/default-avatar.png"
              }
              className="w-20 h-20 rounded-full mx-auto object-cover"
            />

            <h4 className="text-center font-semibold mt-3">{t.name}</h4>
            <p className="text-center text-sm text-gray-500">{t.city}</p>

            <p className="text-sm text-gray-700 mt-3 text-center">
              "{t.message}"
            </p>

            <div className="flex justify-center text-yellow-500 mt-2">
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>

            <div className="text-xs text-center text-gray-400 mt-2">
              {t.plan} • {t.date}
            </div>

          </div>
        ))}
      </section>

      <section className="text-center mb-16">
        <h3 className="text-lg font-semibold mb-2">Have your own story?</h3>
        <p className="text-sm text-gray-600 mb-4">
          We’d love to feature you on our website and social media!
        </p>

        <a
          href="https://wa.me/919999999999"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full font-medium inline-flex items-center gap-2"
        >
          Submit Your Testimonial via WhatsApp
        </a>
      </section>

      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50"
      >
        <FaWhatsapp /> Chat with Us
      </a>

    </div>
  );
};

export default TestimonialsPage;