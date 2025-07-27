// VendorPerformanceReportPage.js - Full React + Bootstrap UI with Charts, Heatmap & CSV Export
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaArrowUp, FaArrowDown, FaFileExport, FaSearch } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const mockVendors = [
  {
    id: 1,
    name: "GoldStar Jewels",
    orders: 1200,
    revenue: 950000,
    returns: 2.1,
    rating: 4.7,
    dispatchTime: 1.3,
    location: "Mumbai",
    score: 94,
    tag: "Top Seller",
  },
  {
    id: 2,
    name: "FashionKart",
    orders: 980,
    revenue: 770000,
    returns: 3.5,
    rating: 4.4,
    dispatchTime: 2.1,
    location: "Delhi",
    score: 88,
    tag: "Fast Fulfillment",
  },
  {
    id: 3,
    name: "ElectroMax",
    orders: 750,
    revenue: 540000,
    returns: 4.2,
    rating: 4.2,
    dispatchTime: 2.8,
    location: "Bangalore",
    score: 83,
    tag: "Rising Star",
  },
];

const mockMonthlyTrends = [
  { month: "Jan", revenue: 500000, returns: 3.2 },
  { month: "Feb", revenue: 550000, returns: 3.0 },
  { month: "Mar", revenue: 620000, returns: 2.8 },
  { month: "Apr", revenue: 700000, returns: 3.5 },
  { month: "May", revenue: 750000, returns: 2.6 },
  { month: "Jun", revenue: 800000, returns: 2.4 },
];

const VendorPerformanceReportPage = () => {
  const [vendors, setVendors] = useState(mockVendors);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const header = "Vendor,Orders,Revenue,Returns,Rating,Dispatch Time,Location,Score\n";
    const rows = filteredVendors.map(v => `${v.name},${v.orders},${v.revenue},${v.returns},${v.rating},${v.dispatchTime},${v.location},${v.score}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendor_performance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
  <>
  <Header />
    <div className="container py-4 px-4 my-4 border border-gray rounded">
      <h2 className="text-center mb-4  text-black font-thin text-3xl " style ={{ textDecoration: "underline", textUnderlinePosition: "under" }}>
        Vendor Performance Report
      </h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="input-group w-50">
          <span className="input-group-text bg-light ">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline-success  d-flex flex-row  align-items-center" onClick={exportCSV}>
          <FaFileExport className="me-2  " /> Export CSV
        </button>
      </div>

      {/* KPI Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light fw-bold">Vendor KPIs</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Vendor Name</th>
                <th>Orders</th>
                <th>Revenue (₹)</th>
                <th>Return Rate (%)</th>
                <th>Rating</th>
                <th>Dispatch Time (days)</th>
                <th>Location</th>
                <th>Score</th>
                <th>Tag</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((v, i) => (
                <tr key={v.id}>
                  <td>{i + 1}</td>
                  <td><strong>{v.name}</strong></td>
                  <td>{v.orders}</td>
                  <td>₹{v.revenue.toLocaleString()}</td>
                  <td>
                    {v.returns} %
                    {v.returns < 3 ? <FaArrowDown className="text-success ms-1" /> : <FaArrowUp className="text-danger ms-1" />}
                  </td>
                  <td><span className="badge bg-warning text-dark"><FaStar className="me-1" /> {v.rating}</span></td>
                  <td>{v.dispatchTime}d</td>
                  <td>{v.location}</td>
                  <td>
                    <span className={`badge bg-${v.score > 90 ? "success" : v.score > 80 ? "primary" : "danger"}`}>{v.score}/100</span>
                  </td>
                  <td><span className="badge bg-info text-dark">{v.tag}</span></td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center text-muted">No vendors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

   <div className="d-flex flex-row   gap-3 mb-4 h-100 w-100">
       {/* Trend Chart */}
      <div className="card shadow-sm w-100">
        <div className="card-header  fw-bold">Monthly Revenue & Return Trends</div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockMonthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#007bff" name="Revenue" />
              <Line type="monotone" dataKey="returns" stroke="#dc3545" name="Returns (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Heatmap (BarChart by location) */}
      <div className="card shadow-sm w-50">
        <div className="card-header bg-light fw-bold">Vendor Distribution by Region</div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockVendors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#198754" name="Orders" />
              <Bar dataKey="revenue" fill="#0d6efd" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
   </div>
    </div>
  <Footer />
  </>
  );
};

export default VendorPerformanceReportPage;
