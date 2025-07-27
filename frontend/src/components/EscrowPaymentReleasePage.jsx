import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Form, Modal, Badge, Alert, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EscrowPaymentReleasePage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");

  const escrowOrders = [
    {
      id: "ORD12345",
      vendor: "GoldSeller Pvt Ltd",
      amount: 8200,
      deliveryStatus: "Delivered",
      customerConfirmed: true,
      disputeStatus: "None",
      payoutStatus: "Pending",
      eligible: true,
    },
    {
      id: "ORD12346",
      vendor: "ShineJewels",
      amount: 4500,
      deliveryStatus: "Delivered",
      customerConfirmed: false,
      disputeStatus: "Open",
      payoutStatus: "Blocked",
      eligible: false,
    },
    {
      id: "ORD12347",
      vendor: "PearlCrafts India",
      amount: 6200,
      deliveryStatus: "Delivered",
      customerConfirmed: true,
      disputeStatus: "None",
      payoutStatus: "Auto-Scheduled",
      eligible: true,
    },
  ];

  const handleRelease = (order) => {
    setSelectedOrder(order);
    setShowProofModal(true);
  };

  const confirmRelease = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowProofModal(false);
      setProofFile(null);
      setSuccessAlert(`✅ Payment released for Order ${selectedOrder.id}`);
      setTimeout(() => setSuccessAlert(""), 5000);
    }, 2000);
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h2 className="text-center mb-4">💰 Escrow Payment Release</h2>

        {/* Alert on release success */}
        {successAlert && <Alert variant="success">{successAlert}</Alert>}

        {/* Escrow Orders Table */}
        <div className="card shadow p-4 rounded-4 mb-4">
          <h5 className="mb-3">🔐 Orders in Escrow</h5>
          <Table responsive bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Delivery</th>
                <th>Customer</th>
                <th>Dispute</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {escrowOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.vendor}</td>
                  <td>₹{order.amount}</td>
                  <td>
                    <Badge bg="success">{order.deliveryStatus}</Badge>
                  </td>
                  <td>
                    {order.customerConfirmed ? (
                      <Badge bg="primary">Confirmed</Badge>
                    ) : (
                      <Badge bg="secondary">Not Confirmed</Badge>
                    )}
                  </td>
                  <td>
                    {order.disputeStatus === "None" ? (
                      <Badge bg="success">No Dispute</Badge>
                    ) : (
                      <Badge bg="danger">Dispute Open</Badge>
                    )}
                  </td>
                  <td>
                    <Badge bg="warning">{order.payoutStatus}</Badge>
                  </td>
                  <td>
                    {order.eligible && order.disputeStatus === "None" ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleRelease(order)}
                      >
                        Release Now
                      </Button>
                    ) : (
                      <span className="text-muted">Hold</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Upload Modal */}
        <Modal show={showProofModal} onHide={() => setShowProofModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>📤 Upload Payout Proof</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Releasing payment to <strong>{selectedOrder?.vendor}</strong> for{" "}
              <strong>{selectedOrder?.id}</strong>
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Upload UTR Slip / Screenshot</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProofFile(e.target.files[0])}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={confirmRelease}
              disabled={!proofFile || loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Releasing...
                </>
              ) : (
                "Confirm & Release"
              )}
            </Button>
          </Modal.Body>
        </Modal>

        {/* Admin Batch Release Upload */}
        <div className="card p-4 shadow mt-5 rounded-4">
          <h5>📤 Batch Escrow Release (Admin Panel)</h5>
          <Form>
            <Form.Group controlId="uploadCSV" className="mb-3">
              <Form.Label>Upload Release CSV (Order ID, Vendor ID, Amount)</Form.Label>
              <Form.Control type="file" accept=".csv" />
            </Form.Group>
            <Button variant="primary">Process Batch Release</Button>
          </Form>
          <p className="mt-3 text-muted">
            💡 Tip: Download pending orders as CSV → edit → upload for batch release.
          </p>
        </div>

        {/* Smart/Advanced Features */}
        <div className="card p-4 shadow mt-5 bg-light rounded-4">
          <h5>🧠 Upcoming Advanced Features</h5>
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li>⏱ Auto-Release after X days if no dispute</li>
                <li>🔐 Multi-admin Approval Flow</li>
                <li>📊 Payout Tax Invoice Summary</li>
                <li>📥 Vendor Payout Statements</li>
                <li>📤 CSV Batch Upload + Logs</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul>
                <li>📡 Blockchain-based Smart Escrow (optional)</li>
                <li>🔍 Payout Audit Log & History</li>
                <li>📨 Vendor Payout Notification (Email/SMS)</li>
                <li>🏦 Bank Sync + KYC Verification</li>
                <li>🧠 Escrow Risk Engine for Suspicious Accounts</li>
              </ul>
            </div>
          </div>
          <small className="text-muted">
            These will be rolled out under BBSCART’s upcoming security roadmap.
          </small>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EscrowPaymentReleasePage;
