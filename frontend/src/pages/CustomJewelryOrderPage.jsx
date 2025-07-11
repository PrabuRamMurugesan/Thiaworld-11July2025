import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CustomJewelryOrderPage = () => {
  const [designFiles, setDesignFiles] = useState([]);
  const [formData, setFormData] = useState({
    jewelryType: "",
    metalType: "",
    weightEstimate: "",
    stoneType: "",
    engraving: "",
    deliveryDate: "",
    specialNotes: "",
  });
  const [priceEstimate, setPriceEstimate] = useState(null);

  const handleFileChange = (e) => {
    setDesignFiles([...e.target.files]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const estimatePrice = () => {
    const baseGoldRate = 6000;
    const estimatedWeight = parseFloat(formData.weightEstimate || 0);
    const makingCharge = 1000;
    const gemstoneCost = formData.stoneType ? 2000 : 0;
    const total = baseGoldRate * estimatedWeight + makingCharge + gemstoneCost;
    setPriceEstimate(total.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Custom jewelry order submitted successfully!");
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">✨ Custom Jewelry Order</h2>

        <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
          <h5 className="mb-3">1. Upload Your Design</h5>
          <input
            type="file"
            className="form-control mb-3"
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.svg,.cad"
            onChange={handleFileChange}
          />

          <div className="alert alert-info">
            <strong>🔐 IP Protection Enabled:</strong> Your design is securely stored and protected.
          </div>

          <h5 className="mb-3">2. Customize Your Jewelry</h5>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Jewelry Type</label>
              <select className="form-control" name="jewelryType" onChange={handleInputChange} required>
                <option value="">-- Select --</option>
                <option>Ring</option>
                <option>Necklace</option>
                <option>Bangle</option>
                <option>Earring</option>
                <option>Pendant</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>Metal Type</label>
              <select className="form-control" name="metalType" onChange={handleInputChange} required>
                <option value="">-- Select --</option>
                <option>22K Gold</option>
                <option>18K Gold</option>
                <option>Rose Gold</option>
                <option>White Gold</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label>Estimated Weight (grams)</label>
              <input type="number" className="form-control" name="weightEstimate" onChange={handleInputChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Stone/Gemstone (Optional)</label>
              <input type="text" className="form-control" name="stoneType" onChange={handleInputChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Engraving (if any)</label>
              <input type="text" className="form-control" name="engraving" onChange={handleInputChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label>Preferred Delivery Date</label>
              <input type="date" className="form-control" name="deliveryDate" onChange={handleInputChange} />
            </div>
            <div className="col-12 mb-3">
              <label>Special Notes for Designer</label>
              <textarea
                rows="3"
                className="form-control"
                name="specialNotes"
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button type="button" className="btn btn-outline-primary" onClick={estimatePrice}>
              🔍 Estimate Price
            </button>
            {priceEstimate && <h5 className="text-success">Estimated Price: ₹{priceEstimate}</h5>}
          </div>

          <hr className="my-4" />

          <div className="text-center">
            <button type="submit" className="btn btn-success btn-lg px-5">
              📤 Place Custom Order
            </button>
          </div>
        </form>

        {/* Advanced Features Section */}
        {/* <div className="mt-5">
          <h4 className="mb-3">🔮 Advanced Features (Coming Soon)</h4>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-info shadow-sm">
                <div className="card-body">
                  <h6>🧠 AI-Based Design Analyzer</h6>
                  <p className="small text-muted">
                    Automatically interpret your design and estimate weight, material, and cost.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-warning shadow-sm">
                <div className="card-body">
                  <h6>🖼 3D Preview Generator</h6>
                  <p className="small text-muted">
                    View a 3D preview of your jewelry before production.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-success shadow-sm">
                <div className="card-body">
                  <h6>🛍️ Part Payment & EMI Option</h6>
                  <p className="small text-muted">
                    Pay 50% now or opt for EMI via Razorpay/UPI/Credit Card.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-primary shadow-sm">
                <div className="card-body">
                  <h6>💬 Live Chat with Designer</h6>
                  <p className="small text-muted">
                    Get live assistance from our design expert before placing your order.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-secondary shadow-sm">
                <div className="card-body">
                  <h6>🧾 Shareable Quotation Generator</h6>
                  <p className="small text-muted">
                    Download a quote PDF to share for approvals or internal use.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-danger shadow-sm">
                <div className="card-body">
                  <h6>🔐 Secure Design Upload with IP Protection</h6>
                  <p className="small text-muted">
                    Your designs are stored securely with encryption and IP protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <Footer />
    </>
  );
};

export default CustomJewelryOrderPage;
