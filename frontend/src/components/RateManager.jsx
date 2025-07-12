import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";

const RateManager = ({ metalType }) => {
  const [form, setForm] = useState({
    carat: "24K",
    marketPrice: 0,
    ratePerGram: 0,
    makingCharges: 0,
    wastagePercentage: 0,
    stoneCharges: 0,
    otherCharges: 0,
    autoApply: false,
    source: "Manual",
    effectiveDate: "",
    note: "",
  });
  const [rates, setRates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_API_BASE_URL;

  const fetchRates = async () => {
    setLoading(true);
    const res = await axios.get(
      `${API}/api/goldrate/all?metalType=${metalType}`
    );
    setRates(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${API}/api/goldrate/update/${editingId}`, {
          metalType,
          ...form,
        });
        setMessage("Updated successfully!");
      } else {
        await axios.post(`${API}/api/goldrate/create`, {
          metalType,
          ...form,
        });
        setMessage("Added successfully!");
      }
      clearForm();
      fetchRates();
    } catch (err) {
      console.error(err);
      setMessage("Error occurred.");
    }
  };

  const clearForm = () => {
    setForm({
      carat: "24K",
      marketPrice: 0,
      ratePerGram: 0,
      makingCharges: 0,
      wastagePercentage: 0,
      stoneCharges: 0,
      otherCharges: 0,
      autoApply: false,
      source: "Manual",
      effectiveDate: "",
      note: "",
    });
    setEditingId(null);
  };

  const handleEdit = (rate) => {
    setEditingId(rate._id);
    setForm(rate);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this rate?")) {
      await axios.delete(`${API}/api/goldrate/delete/${id}`);
      fetchRates();
    }
  };

  return (
    <Container>
      <h3>{metalType} Rate Manager</h3>
      {message && <Alert variant="info">{message}</Alert>}

      <Form>
        <Row>
          <Col md={2}>
            <Form.Label>Carat</Form.Label>
            <Form.Select
              name="carat"
              value={form.carat}
              onChange={handleChange}
            >
              <option>24K</option>
              <option>22K</option>
              <option>18K</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Market Price</Form.Label>
            <Form.Control
              name="marketPrice"
              type="number"
              value={form.marketPrice}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Rate/Gram</Form.Label>
            <Form.Control
              name="ratePerGram"
              type="number"
              value={form.ratePerGram}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Making %</Form.Label>
            <Form.Control
              name="makingCharges"
              type="number"
              value={form.makingCharges}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Wastage %</Form.Label>
            <Form.Control
              name="wastagePercentage"
              type="number"
              value={form.wastagePercentage}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Stone Charges</Form.Label>
            <Form.Control
              name="stoneCharges"
              type="number"
              value={form.stoneCharges}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={2}>
            <Form.Label>Other Charges</Form.Label>
            <Form.Control
              name="otherCharges"
              type="number"
              value={form.otherCharges}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Source</Form.Label>
            <Form.Select
              name="source"
              value={form.source}
              onChange={handleChange}
            >
              <option>Manual</option>
              <option>MMTC-PAMP</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Effective Date</Form.Label>
            <Form.Control
              name="effectiveDate"
              type="date"
              value={form.effectiveDate}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Form.Check
              label="Auto Apply"
              name="autoApply"
              checked={form.autoApply}
              onChange={handleChange}
            />
          </Col>
          <Col md={4}>
            <Form.Label>Note</Form.Label>
            <Form.Control
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"}
            </Button>{" "}
            <Button variant="secondary" onClick={clearForm}>
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      <hr />
      {loading ? (
        <Spinner />
      ) : (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Carat</th>
              <th>Market</th>
              <th>Rate/gm</th>
              <th>Making%</th>
              <th>Wastage%</th>
              <th>Stone%</th>
              <th>Other</th>
              <th>Source</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => (
              <tr key={r._id}>
                <td>{r.carat}</td>
                <td>{r.marketPrice}</td>
                <td>{r.ratePerGram}</td>
                <td>{r.makingCharges}%</td>
                <td>{r.wastagePercentage}%</td>
                <td>{r.stoneCharges}%</td>
                <td>{r.otherCharges}</td>
                <td>{r.source}</td>
                <td>{new Date(r.effectiveDate).toLocaleDateString()}</td>
                <td>
                  <Button size="sm" onClick={() => handleEdit(r)}>
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RateManager;
