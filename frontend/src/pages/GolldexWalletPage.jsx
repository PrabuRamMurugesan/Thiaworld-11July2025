import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Table, Badge } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";

const GolldexWalletPage = () => {
  const [balance, setBalance] = useState(3200);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "Load",
      amount: 1000,
      method: "UPI",
      date: "2025-07-01",
      status: "Completed",
    },
    {
      id: 2,
      type: "Purchase",
      amount: -450,
      method: "Wallet",
      date: "2025-07-02",
      status: "Completed",
    },
    {
      id: 3,
      type: "Refund",
      amount: 150,
      method: "Wallet",
      date: "2025-07-03",
      status: "Completed",
    },
  ]);

  const handleLoad = () => {
    const newBalance = balance + parseInt(amount);
    const newTransaction = {
      id: transactions.length + 1,
      type: "Load",
      amount: parseInt(amount),
      method: "Card",
      date: new Date().toISOString().split("T")[0],
      status: "Completed",
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(newBalance);
    setAmount("");
    setShowModal(false);
  };

  return (
    <>
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">💼 Golldex Wallet</h1>

        {/* Balance Card */}
        <div className="card p-4 mb-4 shadow rounded-4">
          <h4 className="text-muted">Your Current Balance</h4>
          <h2 className="text-success fw-bold my-3">₹{balance.toLocaleString()}</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Load Wallet
          </Button>
        </div>

        {/* Load Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>🔼 Load Golldex Wallet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="amount">
                <Form.Label>Enter Amount (₹)</Form.Label>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Select Payment Method</Form.Label>
                <Form.Select>
                  <option>UPI</option>
                  <option>Credit/Debit Card</option>
                  <option>Net Banking</option>
                </Form.Select>
              </Form.Group>
              <Button
                variant="success"
                className="mt-4 w-100"
                onClick={handleLoad}
                disabled={!amount}
              >
                Confirm Load
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Transaction History */}
        <div className="card p-4 shadow rounded-4 mt-5">
          <h5 className="mb-3">📜 Wallet Transaction History</h5>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.id}</td>
                  <td>
                    <Badge
                      bg={
                        txn.type === "Refund"
                          ? "info"
                          : txn.type === "Purchase"
                          ? "warning"
                          : "success"
                      }
                    >
                      {txn.type}
                    </Badge>
                  </td>
                  <td>
                    ₹{" "}
                    <strong
                      className={
                        txn.amount < 0 ? "text-danger" : "text-success"
                      }
                    >
                      {Math.abs(txn.amount)}
                    </strong>
                  </td>
                  <td>{txn.method}</td>
                  <td>{txn.date}</td>
                  <td>
                    <Badge bg="secondary">{txn.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Advanced Features */}
        <div className="card p-4 shadow rounded-4 mt-4 bg-light">
          <h5>🚀 Advanced Wallet Features (Coming Soon)</h5>
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li>🔐 Set Wallet PIN / Biometric Lock</li>
                <li>🔁 Auto Top-Up (threshold-based)</li>
                <li>💡 Recharge Recommendations (AI)</li>
                <li>📅 Auto EMI Installments via Wallet</li>
                <li>📊 Usage Analytics & Spend Forecast</li>
                <li>🧾 Wallet Statements (PDF download)</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul>
                <li>🤑 Referral Bonus → Wallet Credit</li>
                <li>🏅 Convert Golldex Points to Balance</li>
                <li>📦 Smart Split Pay (Wallet + Card + EMI)</li>
                <li>🔓 Lock/Pause Wallet Temporarily</li>
                <li>🌐 Cross-Currency Wallet Support</li>
                <li>👥 Shared Family Wallet Access</li>
              </ul>
            </div>
          </div>
          <small className="text-muted">
            *These features are currently in development and will be rolled out
            gradually.*
          </small>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GolldexWalletPage;
