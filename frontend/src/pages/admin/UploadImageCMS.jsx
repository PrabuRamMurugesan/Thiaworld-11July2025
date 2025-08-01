import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const UploadImageCMS = () => {
  const [productId, setProductId] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || images.length === 0) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("category", category);

    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URI}/products/upload-images`,
        formData
      );
      alert("Upload Successful!");
      console.log("Uploaded:", res.data);
    } catch (err) {
      console.error("Upload Failed:", err);
      alert("Error uploading");
    }
  };

  return (
    <Container className="mt-5">
      <h3>Upload Images to Existing Product</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Product ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Product MongoDB ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Select Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Button className="mt-4" type="submit">
          Upload Images
        </Button>
      </Form>
    </Container>
  );
};

export default UploadImageCMS;
