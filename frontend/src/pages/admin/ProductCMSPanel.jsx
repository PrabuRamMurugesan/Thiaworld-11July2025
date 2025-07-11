import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductCMSPanel = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({ category: "", metalType: "", search: "" });

  const [form, setForm] = useState({
    name: "",
    category: "",
    metalType: "",
    metalColor: "",
    netWeight: "",
    grossWeight: "",
    price: "",
    discount: "",
    makingCharges: "",
    gst: "",
    comboGroupId: "",
    isCombo: false,
    isSecurePlanEnabled: false,
    isPartialPaymentEnabled: false,
    isAvailable: true,
    tags: [],
    images: [],
  });

  // 🟡 Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/all");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🟢 Add or update product
  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/update/${editingProduct._id}`, form, {
          headers: { Authorization: "Bearer adminkey123" },
        });
        alert("✅ Product updated!");
      } else {
        await axios.post("http://localhost:5000/api/products/add", form, {
          headers: { Authorization: "Bearer adminkey123" },
        });
        alert("✅ Product added!");
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert("❌ Failed to save product.");
    }
  };

  // 🔴 Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/delete/${id}`, {
        headers: { Authorization: "Bearer adminkey123" },
      });
      alert("✅ Deleted!");
      fetchProducts();
    } catch {
      alert("❌ Failed to delete.");
    }
  };

  // 🧠 Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category ? p.category === filters.category : true) &&
      (filters.metalType ? p.metalType === filters.metalType : true)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-yellow-700">📦 Product CMS Panel</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border rounded px-3 py-2 w-1/3"
        />
        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Category</option>
          <option value="Ring">Ring</option>
          <option value="Necklace">Necklace</option>
          <option value="Bangle">Bangle</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          onChange={(e) => setFilters({ ...filters, metalType: e.target.value })}
        >
          <option value="">Metal</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Platinum">Platinum</option>
        </select>
        <button
          onClick={() => {
            setForm({});
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded shadow hover:bg-yellow-700"
        >
          ➕ Add New Product
        </button>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th>Category</th>
              <th>Metal</th>
              <th>Price</th>
              <th>SecurePlan</th>
              <th>PartialPay</th>
              <th>Combo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{prod.name}</td>
                <td>{prod.category}</td>
                <td>{prod.metalType}</td>
                <td>₹{prod.price}</td>
                <td>{prod.isSecurePlanEnabled ? "✅" : "❌"}</td>
                <td>{prod.isPartialPaymentEnabled ? "✅" : "❌"}</td>
                <td>{prod.isCombo ? "✅" : "❌"}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm(prod);
                      setEditingProduct(prod);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[90%] md:w-[600px] max-h-[90vh] overflow-auto shadow-lg">
            <h2 className="text-lg font-bold mb-4">{editingProduct ? "Edit" : "Add"} Product</h2>

            <div className="grid grid-cols-2 gap-4">
              <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded" />
              <input name="category" value={form.category || ""} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
              <input name="metalType" value={form.metalType || ""} onChange={handleChange} placeholder="Metal Type" className="border p-2 rounded" />
              <input name="metalColor" value={form.metalColor || ""} onChange={handleChange} placeholder="Metal Color" className="border p-2 rounded" />
              <input name="netWeight" value={form.netWeight || ""} onChange={handleChange} placeholder="Net Weight (g)" className="border p-2 rounded" />
              <input name="grossWeight" value={form.grossWeight || ""} onChange={handleChange} placeholder="Gross Weight (g)" className="border p-2 rounded" />
              <input name="price" value={form.price || ""} onChange={handleChange} placeholder="Price ₹" className="border p-2 rounded" />
              <input name="discount" value={form.discount || ""} onChange={handleChange} placeholder="Discount %" className="border p-2 rounded" />
              <input name="makingCharges" value={form.makingCharges || ""} onChange={handleChange} placeholder="Making Charges ₹" className="border p-2 rounded" />
              <input name="gst" value={form.gst || ""} onChange={handleChange} placeholder="GST ₹" className="border p-2 rounded" />
              <input name="comboGroupId" value={form.comboGroupId || ""} onChange={handleChange} placeholder="Combo Group ID" className="border p-2 rounded" />
            </div>

            {/* Toggles */}
            <div className="flex gap-6 mt-4">
              <label><input type="checkbox" name="isCombo" checked={form.isCombo} onChange={handleChange} /> Combo</label>
              <label><input type="checkbox" name="isSecurePlanEnabled" checked={form.isSecurePlanEnabled} onChange={handleChange} /> SecurePlan</label>
              <label><input type="checkbox" name="isPartialPaymentEnabled" checked={form.isPartialPaymentEnabled} onChange={handleChange} /> PartialPay</label>
              <label><input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} /> Available</label>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-between">
              <button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={handleSubmit}
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-600 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCMSPanel;
