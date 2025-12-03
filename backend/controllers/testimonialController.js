const Testimonial = require("../models/Testimonial");

// GET /api/testimonials?productId=...
exports.getTestimonials = async (req, res) => {
  try {
    const { productId } = req.query;
    const q = productId ? { product: productId } : {};
    const testimonials = await Testimonial.find(q)
      .sort({ createdAt: -1 })
      .lean();
    res.json({ testimonials });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/testimonials
exports.addTestimonial = async (req, res) => {
  try {
    const {
      name,
      email,
      productId, // from frontend
      title,
      comment, // from frontend
      rating,
      verified, // checkbox
    } = req.body;

    if (!name || !productId || !comment || !rating)
      return res.status(400).json({ error: "Missing required fields" });

    const doc = await Testimonial.create({
      name,
      email,
      product: productId, // map to "product"
      title,
      message: comment, // map to "message"
      rating: Number(rating),
      verified: !!verified,
      media: [], // keep empty for now
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(404).json({ error: "Not found" });
  }
};
