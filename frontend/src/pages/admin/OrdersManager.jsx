import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("/api/order/all");
    setOrders(res.data);
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleStatusChange = async () => {
    await axios.put(`/api/order/${selectedOrder._id}`, {
      status: selectedOrder.status,
    });
    setShowModal(false);
    fetchOrders();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      await axios.delete(`/api/order/${id}`);
      fetchOrders();
    }
  };

  return (
    <div className="container mt-4">
      <h2>📦 Orders Manager</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount (₹)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.customerName}</td>
              <td>₹{o.totalAmount}</td>
              <td>{o.status}</td>
              <td>
                <Button size="sm" onClick={() => handleView(o)}>
                  View
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(o._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* View/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedOrder.totalAmount}
              </p>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleStatusChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdersManager;
