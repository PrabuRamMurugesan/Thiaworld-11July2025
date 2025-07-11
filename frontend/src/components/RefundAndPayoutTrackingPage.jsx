import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Tab,
  Nav,
  Table,
  Button,
  Alert,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaDownload,
  FaSyncAlt,
  FaBell,
  FaLock,
  FaFileInvoice,
  FaClock,
} from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

const RefundAndPayoutTrackingPage = () => {
  const [activeTab, setActiveTab] = useState("refunds");
  const [modal, setModal] = useState({ show: false, type: "", content: "", data: null });

  const [refunds, setRefunds] = useState([
    {
      id: "#ORD1023",
      date: "2025-07-02",
      amount: "₹2,499",
      mode: "UPI",
      status: "Processing",
      estimatedDate: "2025-07-05",
    },
    {
      id: "#ORD1012",
      date: "2025-06-25",
      amount: "₹899",
      mode: "Wallet",
      status: "Completed",
      estimatedDate: "2025-06-28",
    },
  ]);

  const [payouts, setPayouts] = useState([
    {
      id: "#ORD2023",
      date: "2025-07-01",
      amount: "₹8,000",
      mode: "Bank Transfer",
      status: "Pending",
      estimatedDate: "2025-07-07",
    },
    {
      id: "#ORD1999",
      date: "2025-06-29",
      amount: "₹5,500",
      mode: "Wallet",
      status: "Completed",
      estimatedDate: "2025-06-30",
    },
  ]);

  const renderStatusBadge = (status) => {
    const variants = {
      Completed: "success",
      Processing: "warning",
      Pending: "info",
      Failed: "danger",
      "On Hold": "secondary",
    };
    return <Badge bg={variants[status] || "light"}>{status}</Badge>;
  };

  const handleDownload = (id) => {
    const blob = new Blob([`Invoice for ${id}`], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}_invoice.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRetry = (id, type) => {
    if (type === "refunds") {
      setRefunds((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Processing" } : item
        )
      );
    } else {
      setPayouts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Processing" } : item
        )
      );
    }
    setModal({ show: true, type: "info", content: `Retry triggered for ${id}` });
  };

  const handleRaiseIssue = (item, type) => {
    setModal({ show: true, type: "form", content: "Raise Issue", data: { ...item, type } });
  };

  const submitIssue = (e) => {
    e.preventDefault();
    setModal({ show: true, type: "info", content: "Issue submitted successfully!" });
  };

  const RefundsTable = () => (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Mode</th>
          <th>Status</th>
          <th>ETA</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {refunds.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.date}</td>
            <td>{item.amount}</td>
            <td>{item.mode}</td>
            <td>{renderStatusBadge(item.status)}</td>
            <td><FaClock /> {item.estimatedDate}</td>
            <td>
              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleDownload(item.id)}>
                <FaDownload /> Invoice
              </Button>
              <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleRaiseIssue(item, "refunds")}>
                <FaBell /> Issue
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => handleRetry(item.id, "refunds")}>
                <FaSyncAlt /> Retry
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const PayoutsTable = () => (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Mode</th>
          <th>Status</th>
          <th>ETA</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {payouts.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.date}</td>
            <td>{item.amount}</td>
            <td>{item.mode}</td>
            <td>{renderStatusBadge(item.status)}</td>
            <td><FaClock /> {item.estimatedDate}</td>
            <td>
              <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleDownload(item.id)}>
                <FaFileInvoice /> Invoice
              </Button>
              <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleRaiseIssue(item, "payouts")}>
                <FaBell /> Issue
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => handleRetry(item.id, "payouts")}>
                <FaSyncAlt /> Retry
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
   <>
   <Header/>
     <div className="vh-100 d-flex flex-column ">
         <div className="container my-4 p-4 border">
      <h2 className="mb-4 text-center">💸 Refund & Payout Tracking</h2>

      <Alert variant="info">
        Track your <strong>Customer Refunds</strong> and <strong>Vendor Payouts</strong>. View real-time status,
        download invoices, and raise issues.
      </Alert>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4 justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="refunds">🔁 Refunds</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="payouts">📤 Payouts</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="refunds">
            {RefundsTable()}
          </Tab.Pane>
          <Tab.Pane eventKey="payouts">
            {PayoutsTable()}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modal Logic */}
      <Modal show={modal.show} onHide={() => setModal({ show: false, type: "", content: "" })} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modal.type === "form" ? "Raise an Issue" : "Action Result"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.type === "form" && modal.data ? (
            <Form onSubmit={submitIssue}>
              <Form.Group className="mb-3">
                <Form.Label>Order ID</Form.Label>
                <Form.Control type="text" value={modal.data.id} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Issue Description</Form.Label>
                <Form.Control as="textarea" required placeholder="Describe your issue..." />
              </Form.Group>
              <Button type="submit" variant="primary">Submit Issue</Button>
            </Form>
          ) : (
            <p>{modal.content}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ show: false, type: "", content: "" })}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
     </div>
   <Footer/>
   </>
  );
};

export default RefundAndPayoutTrackingPage;
