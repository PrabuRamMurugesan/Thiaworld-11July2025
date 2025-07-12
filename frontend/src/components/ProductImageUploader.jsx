import React, { useState } from "react";
import axios from "axios";

const ProductImageUploader = ({ productId, currentImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", "Product Image");

    try {
      const res = await axios.post(
        `${API}/api/products/${productId}/upload-image`,
        formData
      );
      alert("Upload successful!");
      setPreviewUrl(`${API}${res.data.product.image.url}`);
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    }
  };

  return (
    <div className="text-center">
      <h5 className="mb-2">Upload Product Image</h5>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ maxWidth: "200px", borderRadius: "8px" }}
        />
      )}
      <div className="mt-2">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button className="btn btn-success mt-2" onClick={handleUpload}>
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default ProductImageUploader;
