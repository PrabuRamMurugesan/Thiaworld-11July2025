import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get("/api/customer/all");
    setCustomers(res.data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`/api/customer/${editingId}`, form);
    } else {
      await axios.post("/api/customer/create", form);
    }
    setShowModal(false);
    setForm({ name: "", email: "", phone: "" });
    setEditingId(null);
    fetchCustomers();
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditingId(c._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this customer?")) {
      await axios.delete(`/api/customer/${id}`);
      fetchCustomers();
    }
  };

  return (
    <div className="container mt-4">
      <h2>👥 Customers Manager</h2>
      <Button variant="success" onClick={() => setShowModal(true)}>
        ➕ Add Customer
      </Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(c)}>
                  Edit
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit" : "Add"} Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {editingId ? "Update" : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomersManager;
