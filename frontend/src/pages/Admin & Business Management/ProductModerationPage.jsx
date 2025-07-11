import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaUndo,
  FaUserShield,
  FaSearch,
  FaBrain,
  FaClock,
} from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
const rejectionTemplates = [
  "Blurry or low-quality image",
  "Incomplete product description",
  "Pricing error",
  "Category mismatch",
];

const initialProducts = [
  {
    id: 101,
    title: "22K Gold Necklace",
    vendor: "ThiaWorld Jewels",
    category: "Jewellery",
    price: "₹52,000",
    status: "Pending",
    submittedAt: "2025-07-02",
    image:
      "https://cdn.pixabay.com/photo/2016/02/02/15/55/jewellery-1175535_1280.jpg",
    qualityScore: 88,
    aiSuggestion: "Likely Safe to Approve",
  },
  {
    id: 102,
    title: "Men's Leather Watch",
    vendor: "TimeCrafters",
    category: "Watches",
    price: "₹8,499",
    status: "Pending",
    submittedAt: "2025-07-03",
    image:
      "https://media.istockphoto.com/photos/jewelry-picture-id118199633?b=1&k=20&m=118199633&s=170667a&w=0&h=adiDUP_6maGKPKpmX0SDGSGxr9h5gr85qyj1fZ8vT2E=",
    qualityScore: 67,
    aiSuggestion: "Check for Duplicate Image",
  },
];

const ProductModerationPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [lastAction, setLastAction] = useState(null);

  const handleModeration = (id, action, note = "") => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            status:
              action === "approve"
                ? "Approved"
                : action === "reject"
                ? "Rejected"
                : "Flagged",
            note: note,
          }
        : p
    );
    setLastAction({ id, prev: products.find((p) => p.id === id) });
    setProducts(updated);
  };

  const handleUndo = () => {
    if (lastAction) {
      setProducts((prev) =>
        prev.map((p) => (p.id === lastAction.id ? lastAction.prev : p))
      );
      setLastAction(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Header />
      <div className="container p-5 my-4 ">
        <h3 className="mb-4 xl:text-3xl">🛡️ Product Approval & Moderation Panel</h3>

        <div className="border border-black rounded-xl p-5 ">
          {/* Search and Filter */}
          <div className="d-flex gap-6 mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or vendor"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                disabled={!lastAction}
                onClick={handleUndo}
              >
                <FaUndo className="me-1" />
                Undo Last Action
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped align-middle border border-black  ">
              <thead className="table-white bg-black text-white text-center ">
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Vendor</th>
                  <th>AI Suggestion</th>
                  <th>Quality</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="rounded"
                          style={{
                            width: 150,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{product.title}</td>
                      <td>
                        {product.vendor}
                        <br />
                        <small className="text-muted">
                          <FaUserShield className="me-1" />
                          Trusted
                        </small>
                      </td>
                      <td>
                        <FaBrain className="me-1 text-info" />
                        {product.aiSuggestion}
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            product.qualityScore > 80
                              ? "success"
                              : product.qualityScore > 60
                              ? "warning text-dark"
                              : "danger"
                          }`}
                        >
                          {product.qualityScore}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            product.status === "Approved"
                              ? "success"
                              : product.status === "Rejected"
                              ? "danger"
                              : product.status === "Flagged"
                              ? "warning text-dark"
                              : "secondary"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <FaClock className="me-1" />
                        {product.submittedAt}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() =>
                            handleModeration(product.id, "approve")
                          }
                          disabled={product.status !== "Pending"}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => {
                            const template = prompt(
                              `Select Rejection Reason:\n${rejectionTemplates
                                .map((t, i) => `${i + 1}. ${t}`)
                                .join("\n")}`
                            );
                            const reasonIndex = parseInt(template);
                            if (
                              !isNaN(reasonIndex) &&
                              rejectionTemplates[reasonIndex - 1]
                            ) {
                              handleModeration(
                                product.id,
                                "reject",
                                rejectionTemplates[reasonIndex - 1]
                              );
                            }
                          }}
                          disabled={product.status !== "Pending"}
                        >
                          <FaTimesCircle /> Reject
                        </button>
                        <button
                          className="btn btn-sm btn-warning text-dark"
                          onClick={() => {
                            const flagReason = prompt("Enter flag reason:");
                            if (flagReason)
                              handleModeration(product.id, "flag", flagReason);
                          }}
                          disabled={product.status !== "Pending"}
                        >
                          <FaFlag /> Flag
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductModerationPage;
