import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Row, Col, Modal } from "react-bootstrap";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [goldRates, setGoldRates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    shortDescription: "",
    description: "",
    weight: 0,
    metalType: "",
    metalCarat: "",
    makingCharges: 0,
    makingChargesDiscount: 0,
    autoUpdatePrice: false,
    price: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchGoldRates();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URI}/product/all`);
    setProducts(res.data);
  };

  const fetchGoldRates = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URI}/goldrate/all`);
    setGoldRates(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const calculatePrice = () => {
    if (
      form.autoUpdatePrice &&
      form.metalType === "Gold" &&
      form.metalCarat &&
      form.weight > 0
    ) {
      const rate = goldRates.find((r) => r.caratType === form.metalCarat);
      if (rate) {
        const base = form.weight * rate.pricePerGram;
        const total =
          base +
          parseFloat(form.makingCharges || 0) -
          parseFloat(form.makingChargesDiscount || 0);
        setForm({ ...form, price: Math.round(total) });
      }
    }
  };

  useEffect(() => {
    calculatePrice();
    // eslint-disable-next-line
  }, [
    form.weight,
    form.metalCarat,
    form.autoUpdatePrice,
    form.makingCharges,
    form.makingChargesDiscount,
  ]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URI}/product/${editingId}`,
          form
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URI}/products/add`, form);
      }
      alert("✅ Product saved/updated!");
      setShowModal(false);
      setForm({
        sku: "",
        name: "",
        shortDescription: "",
        description: "",
        weight: 0,
        metalType: "",
        metalCarat: "",
        makingCharges: 0,
        makingChargesDiscount: 0,
        autoUpdatePrice: false,
        price: 0,
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error saving product");
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await axios.delete(`${import.meta.env.VITE_API_URI}/product/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛍️ Product Manager</h2>
      <Button variant="success" onClick={() => setShowModal(true)}>
        ➕ Add Product
      </Button>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Price (₹)</th>
            <th>Metal</th>
            <th>Weight (g)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                {p.metalType} {p.metalCarat}
              </td>
              <td>{p.weight}g</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(p)}>
                  Edit
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Short Description</Form.Label>
                  <Form.Control
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    as="textarea"
                    rows={2}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    as="textarea"
                    rows={4}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Metal Type</Form.Label>
                  <Form.Select
                    name="metalType"
                    value={form.metalType}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Metal Carat</Form.Label>
                  <Form.Select
                    name="metalCarat"
                    value={form.metalCarat}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {goldRates.map((r) => (
                      <option key={r._id} value={r.caratType}>
                        {r.caratType} - ₹{r.pricePerGram}/g
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Weight (grams)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={form.weight}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Making Charges</Form.Label>
                  <Form.Control
                    type="number"
                    name="makingCharges"
                    value={form.makingCharges}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Making Charges Discount</Form.Label>
                  <Form.Control
                    type="number"
                    name="makingChargesDiscount"
                    value={form.makingChargesDiscount}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    label="Auto Update Price"
                    name="autoUpdatePrice"
                    checked={form.autoUpdatePrice}
                    onChange={handleCheckbox}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Calculated Price</Form.Label>
                  <Form.Control value={form.price} readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary">
              {editingId ? "Update Product" : "Save Product"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManager;
