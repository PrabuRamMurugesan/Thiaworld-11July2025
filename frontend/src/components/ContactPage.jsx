import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaShieldAlt,
} from "react-icons/fa";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message submitted! We will contact you shortly.", {
          position: "top-center",
        });

        setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Submission failed", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Submit error:", err.message);
      toast.error("Something went wrong", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Header />

      <div className="bg-gray-50 text-gray-800 p-5 my-8 max-w-6xl mx-auto border rounded-xl shadow-l">
        <section className="text-center mb-10">
          <h1 className="font-serif text-3xl">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            Have a question, concern, or feedback? We’d love to hear from you.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full border p-3 rounded"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full border p-3 rounded"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full border p-3 rounded"
            />

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              <option value="">Select Subject</option>
              <option value="general">General</option>
              <option value="order">Order Related</option>
              <option value="payment">Payment or Secure Plan</option>
              <option value="technical">Technical Help</option>
            </select>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              placeholder="Your Message"
              className="w-full border p-3 rounded"
            ></textarea>

            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
            >
              Send Message
            </button>
          </form>

          {/* RIGHT SIDE DETAILS */}
          <div className="space-y-5 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-yellow-600" /> +91 413 291 5916
            </div>

            <div className="flex items-center gap-3">
              <MdOutlinePhoneAndroid className="text-yellow-600" /> +91
              9600729596
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-600" /> info@bbscart.com
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-yellow-600" /> Address: No.7, II
              Floor, Bharathy Street, Ist Cross, Anna Nagar Extension,
              Puducherry – 605005.
            </div>

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

            <div className="text-gray-500 text-xs">
              Working Hours: Mon–Sat, 10:00 AM – 7:00 PM
            </div>

            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                className="text-green-600 text-lg"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://instagram.com/thiaworld"
                target="_blank"
                className="text-pink-500 text-lg"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/thiaworld"
                target="_blank"
                className="text-blue-600 text-lg"
              >
                <FaFacebookF />
              </a>
            </div>

            {/* <div className="mt-6 space-y-2">
              <a href="/faqs" className="text-yellow-600 underline text-sm">
                Go to FAQs
              </a>
              <a
                href="/book-appointment"
                className="text-yellow-600 underline text-sm"
              >
                Book an Appointment
              </a>
            </div> */}

            <div className="mt-6 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-500" /> BIS Certified Jewelry
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-500" /> Verified by Golldex
                Secure Plan
              </div>
              <p>
                Your information is safe and encrypted. We respect your privacy.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Visit Our Showroom
          </h2>
          <iframe
            title="Thiaworld Location"
            src="https://www.google.com/maps/embed?pb=!1m18!... (insert correct map)"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg border border-gray-950 p-3 bg-white hover:bg-amber-500"
          ></iframe>
        </section>

        {/* FLOATING WHATSAPP BUTTON */}
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50"
        >
          <FaWhatsapp /> Chat Now
        </a>
      </div>

      <Footer />

      {/* TOAST CONTAINER */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

export default ContactPage;
