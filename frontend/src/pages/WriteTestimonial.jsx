import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import thiaAPI from "../services/thiaAPI"; // <-- new client for products/testimonials

const Star = ({ filled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="star"
    className={`text-xl ${filled ? "text-yellow-500" : "text-gray-300"}`}
  >
    ★
  </button>
);

export default function WriteTestimonial() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    productId,
    verified: false,
    rating: 0,
    title: "",
    comment: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [productName, setProductName] = useState("");

  // fetch product name for display
  useEffect(() => {
    (async () => {
      try {
        const { data } = await thiaAPI.get(`/products/public/${productId}`);
        setProductName(data?.name || "");
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    })();
  }, [productId]);

  const setRating = (r) => setForm((f) => ({ ...f, rating: r }));

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment || !form.rating) {
      alert("Please fill the required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await thiaAPI.post("/testimonials", form);
      alert("Thanks! Your testimonial was submitted.");
      navigate(`/product/${productId}`);
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Share Your Testimonial</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white p-6 rounded border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm">
            Name *
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="border rounded px-3 py-2"
              placeholder="Your name"
              required
            />
          </label>

          <label className="flex flex-col text-sm">
            Email
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="border rounded px-3 py-2"
              placeholder="Your email (optional)"
              type="email"
            />
          </label>
        </div>

        <label className="flex flex-col text-sm">
          Product
          <input
            value={productName || productId}
            className="border rounded px-3 py-2 bg-gray-100"
            disabled
          />
        </label>

        <div className="flex items-center gap-3">
          <span className="text-sm">Rating *</span>
          {[1, 2, 3, 4, 5].map((r) => (
            <Star
              key={r}
              filled={form.rating >= r}
              onClick={() => setRating(r)}
            />
          ))}
          <label className="flex items-center gap-2 text-sm ml-4">
            <input
              type="checkbox"
              name="verified"
              checked={form.verified}
              onChange={onChange}
            />
            Verified Purchase
          </label>
        </div>

        <label className="flex flex-col text-sm">
          Title
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="border rounded px-3 py-2"
            placeholder="Short title for your review"
          />
        </label>

        <label className="flex flex-col text-sm">
          Comment *
          <textarea
            name="comment"
            value={form.comment}
            onChange={onChange}
            className="border rounded px-3 py-2 h-32"
            placeholder="Write your review here"
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          Upload Images / Videos (not yet wired)
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="border rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
}
