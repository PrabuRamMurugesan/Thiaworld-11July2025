
import React from 'react';
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

const testimonials = [
  {
    name: "Priya R.",
    location: "Chennai",
    quote: "I never thought I could own my bridal necklace so easily. 40% upfront and everything was handled smoothly through Golldex!",
    rating: 5,
    verified: true,
    image: "/assets/user1.png",
    plan: "Secure Plan",
    date: "Feb 2024",
  },
  {
    name: "Amit Sharma",
    location: "Delhi",
    quote: "Loved the clarity and fast service. Golldex really helped during the wedding season. Highly recommended!",
    rating: 4,
    verified: true,
    image: "/assets/user2.png",
    plan: "Secure Plan",
    date: "Jan 2024",
  },
  {
    name: "Deepika Menon",
    location: "Bangalore",
    quote: "No hidden charges, timely delivery, and 100% BIS-certified. Thiaworld earned my trust for life.",
    rating: 5,
    verified: true,
    image: "",
    plan: "Full Payment",
    date: "Mar 2024",
  },
];

const TestimonialsPage = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold">Customer Testimonials</h1>
        <p className="text-gray-600 mt-2">Hear what our happy customers say about Thiaworld and Golldex Secure Plan</p>
      </section>

      {/* Testimonials Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {testimonials.map((t, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              {t.image ? (
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center font-semibold">
                  {t.name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs flex items-center gap-1 text-gray-500">
                  <FaMapMarkerAlt className="text-yellow-500" /> {t.location}
                </p>
              </div>
            </div>

            <p className="text-sm italic">“{t.quote}”</p>

            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: t.rating }).map((_, i) => (
                <FaStar key={i} className="text-yellow-500 text-sm" />
              ))}
            </div>

            <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{t.plan}</span>
              {t.verified && (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <FaCheckCircle /> Verified Buyer
                </span>
              )}
              <span className="ml-auto text-gray-400 text-xs">{t.date}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Optional Video Testimonial Carousel */}
      <section className="mb-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Watch Their Stories</h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full rounded-lg shadow-md"
            src="https://www.youtube.com/embed/some-video-id"
            title="Video Testimonial"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="text-center mb-16">
        <h3 className="text-lg font-semibold mb-2">Have your own story?</h3>
        <p className="text-sm text-gray-600 mb-4">We’d love to feature you on our website and social media!</p>
        <a
          href="https://wa.me/919999999999"
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-full font-medium inline-flex items-center gap-2"
        >
          Submit Your Testimonial via WhatsApp
        </a>
      </section>

      {/* Floating WhatsApp Support Button */}
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
