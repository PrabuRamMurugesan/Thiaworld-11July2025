import React from 'react';
import { useEffect } from 'react';

const ContactSection = () => {
 
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URI}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MGR',
        email: 'mgr@example.com',
        message: 'I love this jewelry site!'
      })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }, []);


  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold text-center mb-6">Get in Touch with <span className="text-yellow-600">Thiaworld</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info + Map */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 text-sm">
            <strong>Email:</strong> support@thiaworld.com
          </p>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="inline-block w-fit bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium shadow"
          >
            💬 Chat on WhatsApp
          </a>

          {/* Google Map Embed */}
          <div className="w-full h-64 border rounded overflow-hidden">
            <iframe
              title="Thiaworld Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.627416326049!2d77.5946!3d10.7905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8593c20a3b2fb%3A0x2bbfe3c5d3c55555!2sThiaworld%20Jewellery%20Showroom!5e0!3m2!1sen!2sin!4v1712399999999"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <form className="flex flex-col gap-4">   
          <input
            type="text"
            placeholder="Your Name"
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <textarea
            placeholder="Your Message"
            rows="5"
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          ></textarea>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-medium px-6 py-2 rounded hover:bg-yellow-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
