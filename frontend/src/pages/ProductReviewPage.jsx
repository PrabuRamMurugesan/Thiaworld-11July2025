// Advanced Product Review & Rating Page - Full React + Bootstrap Code with Inline Bootstrap Styles

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    media: [],
    tags: "",
  });

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, media: [...form.media, ...files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !form.title || !form.description) return alert("Please complete all required fields.");
    const newReview = {
      ...form,
      rating,
      helpful: 0,
      notHelpful: 0,
      verified: true,
      date: new Date().toLocaleDateString(),
    };
    setReviews([newReview, ...reviews]);
    setForm({ title: "", description: "", media: [], tags: "" });
    setRating(0);
  };

  const handleVote = (index, type) => {
    const updated = [...reviews];
    if (type === "up") updated[index].helpful += 1;
    else updated[index].notHelpful += 1;
    setReviews(updated);
  };

  const mediaPreviewStyle = {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
    borderRadius: "6px",
  };

  return (
   <>
   <Header/>
    <div className="container py-5 bg-white">
      <h2 className="mb-4 fw-bold text-dark">Product Reviews & Ratings</h2>

      <div className="mb-5 p-4 bg-light rounded shadow-sm border-start border-primary border-2">
        <h4 className="mb-2">Average Rating: {reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : "N/A"} ⭐</h4>
        <p className="text-muted">Total Reviews: {reviews.length}</p>
      </div>

      <div className="card mb-5 shadow border-0 rounded-4">
        <div className="card-header bg-success text-white rounded-top">Write a Review</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Your Rating</label><br />
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={20}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHover(i + 1)}
                  onMouseLeave={() => setHover(0)}
                  className="me-1"
                  color={i < (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  style={{ cursor: "pointer",display: "inline-block", marginRight: "5px" }}
                />
              ))}
            </div>

            <div className="mb-3">
              <label className="form-label">Review Title</label>
              <input type="text" className="form-control rounded-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Review Description</label>
              <textarea className="form-control rounded-3" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Feature Tags (comma-separated)</label>
              <input type="text" className="form-control rounded-3" placeholder="e.g. Fast Delivery, Good Packaging" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Images or Videos</label>
              <input type="file" accept="image/*,video/*" multiple className="form-control rounded-3" onChange={handleMediaUpload} />
              <div className="d-flex mt-3 flex-wrap gap-2">
                {form.media.map((file, idx) =>
                  file.type.includes("image") ? (
                    <img key={idx} src={URL.createObjectURL(file)} alt="preview" style={mediaPreviewStyle} />
                  ) : (
                    <video key={idx} src={URL.createObjectURL(file)} style={mediaPreviewStyle} controls />
                  )
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-success">Submit Review</button>
          </form>
        </div>
      </div>

      <div className="mb-4 shadow border-3 rounded-4 p-4 ">
        <h4 className="mb-3 text-secondary text-center font-serif border-bottom pb-2">All Reviews</h4>
        {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
        {reviews.map((review, index) => (
          <div key={index} className="">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong className="text-success">{review.verified ? "Verified Purchase" : "User"}</strong>
                <span className="text-muted small">{review.date}</span>
              </div>
              <div className="mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={20} color={i < review.rating ? "#ffc107" : "#e4e5e9"} style={{ display: "inline-block", marginRight: "5px" }}/>
                  
                ))}
              </div>
              <h5>{review.title}</h5>
              <p>{review.description}</p>
              {review.tags && <p className="text-muted small"><strong>Tags:</strong> {review.tags}</p>}
              <div className="d-flex gap-2 flex-wrap mb-2">
                {review.media.map((file, idx) =>
                  file.type.includes("image") ? (
                    <img key={idx} src={URL.createObjectURL(file)} alt="preview" style={mediaPreviewStyle} />
                  ) : (
                    <video key={idx} src={URL.createObjectURL(file)} style={mediaPreviewStyle} controls />
                  )
                )}
              </div>
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-outline-success btn-sm" onClick={() => handleVote(index, "up")}>
                  <FaThumbsUp className="me-1" /> {review.helpful}
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleVote(index, "down")}>
                  <FaThumbsDown className="me-1" /> {review.notHelpful}
                </button>
                <button className="btn btn-outline-secondary btn-sm">Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
   <Footer/>
   </>
  );
};

export default ProductReviewPage;
