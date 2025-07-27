// GoldPriceTrackerPage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Header from "../components/Header";
import Footer from "../components/Footer";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GoldPriceTrackerPage = () => {
  const [goldPrice, setGoldPrice] = useState(6050);
  const [trend, setTrend] = useState("up");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [compareDates, setCompareDates] = useState({ start: "", end: "" });
  const [email, setEmail] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [goldWeight, setGoldWeight] = useState("");
  const [sipAmount, setSipAmount] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = Math.random() > 0.5 ? 30 : -30;
      setGoldPrice((prev) => prev + fluctuation);
      setTrend(fluctuation > 0 ? "up" : "down");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const dummyChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "24K Gold Price",
        data: [6000, 6025, 6040, 6035, 6050, 6070, goldPrice],
        borderColor: "gold",
        backgroundColor: "rgba(255,215,0,0.3)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Weekly Gold Price Trend - ${selectedCity}`,
      },
    },
  };

  const handleCompare = () => {
    alert(`Comparing gold prices from ${compareDates.start} to ${compareDates.end}`);
  };

  const handleDownload = () => {
    const content = `Gold Price in ${selectedCity}: ₹${goldPrice}/gm`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gold_price.txt";
    link.click();
  };

  const handleExportChart = () => {
    alert("Export Chart Feature Coming Soon");
  };

  const handleSubscribe = () => {
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  const handleAlertSet = () => {
    alert(`Alert set for ₹${alertPrice}/gm`);
    setAlertPrice("");
  };

  const handleEstimate = () => {
    if (goldWeight) {
      const estimate = goldWeight * goldPrice;
      alert(`Estimated price: ₹${estimate}`);
    }
  };

  const handleSIP = () => {
    if (sipAmount) {
      const goldAccumulated = sipAmount / goldPrice;
      alert(`With ₹${sipAmount}, you can buy approx ${goldAccumulated.toFixed(2)} gm`);
    }
  };

  return (
 <>
 <Header/>
    <div className="m-3 border ">
      <h2 className="text-center my-4 display-5 fw-semibold">📊 Live Gold Price Tracker</h2>

      <div className="bg-dark text-warning p-2 text-center  mb-3 sticky-top z-3">
        Current 24K Price in {selectedCity}: ₹{goldPrice}/gm
        <span className={`ms-2 ${trend === "up" ? "text-success" : "text-danger"}`}>{trend === "up" ? "▲" : "▼"}</span>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Select City:</label>
          <select className="form-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {["Mumbai", "Delhi", "Chennai", "Hyderabad", "Kolkata"].map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <Line data={dummyChartData} options={chartOptions} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-5">
          <label className="form-label">From:</label>
          <input type="date" className="form-control" value={compareDates.start} onChange={(e) => setCompareDates({ ...compareDates, start: e.target.value })} />
        </div>
        <div className="col-md-5">
          <label className="form-label">To:</label>
          <input type="date" className="form-control" value={compareDates.end} onChange={(e) => setCompareDates({ ...compareDates, end: e.target.value })} />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={handleCompare}>Compare</button>
        </div>
      </div>

      <div className="alert alert-info">
        🤖 <strong>AI Suggestion:</strong> Based on trend patterns, this might be a good time to buy.
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body">
              <h5 className="card-title">🔔 Smart Price Alerts</h5>
              <input type="number" className="form-control mb-2" placeholder="Alert when price drops to..." value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} />
              <button className="btn btn-warning w-100" onClick={handleAlertSet}>Set Alert</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body">
              <h5 className="card-title">💰 Gold Estimator</h5>
              <input type="number" className="form-control mb-2" placeholder="Weight in grams" value={goldWeight} onChange={(e) => setGoldWeight(e.target.value)} />
              <button className="btn btn-success w-100" onClick={handleEstimate}>Estimate</button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-info">
            <div className="card-body">
              <h5 className="card-title">📈 Gold SIP & Investment</h5>
              <input type="number" className="form-control mb-2" placeholder="Monthly Investment ₹" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} />
              <button className="btn btn-info w-100" onClick={handleSIP}>Calculate</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h5 className="fw-semibold">📬 Weekly Gold Insights Newsletter</h5>
        <div className="input-group mb-3">
          <input type="email" className="form-control" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn btn-warning" onClick={handleSubscribe}>Subscribe</button>
        </div>
        <button className="btn btn-outline-secondary me-2" onClick={handleDownload}>Download Price</button>
        <button className="btn btn-outline-secondary" onClick={handleExportChart}>Export Chart</button>
      </div>
    </div>
 <Footer/>
 </>
  );
};

export default GoldPriceTrackerPage;
