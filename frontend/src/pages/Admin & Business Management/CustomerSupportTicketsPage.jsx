// CustomerSupportTicketsPage.js - Enhanced with Chat View
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFileUpload,
  FaPlus,
  FaSearch,
  FaTicketAlt,
  FaPhoneAlt,
  FaRegClock,
} from "react-icons/fa";
import { MdChatBubble, MdStars } from "react-icons/md";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const CustomerSupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({
    orderId: "",
    issueType: "",
    description: "",
    resolution: "",
    files: [],
    callbackRequested: false,
    callbackPhone: "",
  });
  const [previewFiles, setPreviewFiles] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessage, setChatMessage] = useState("");

  const issueTypes = [
    "Damaged item",
    "Late delivery",
    "Wrong item received",
    "Refund not received",
    "Payment failed",
    "Others",
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, files });
    setPreviewFiles(files.map((file) => URL.createObjectURL(file)));
  };

  const estimateResolutionTime = (type) => {
    switch (type) {
      case "Damaged item":
      case "Wrong item received":
        return "3 business days";
      case "Refund not received":
        return "2 business days";
      default:
        return "5 business days";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicket = {
      id: Date.now(),
      ...formData,
      status: "Open",
      submittedAt: new Date().toLocaleString(),
      estimatedResolution: estimateResolutionTime(formData.issueType),
      chat: [
        { sender: "system", text: "Ticket created successfully." },
      ],
    };
    setTickets([newTicket, ...tickets]);
    setFormData({
      orderId: "",
      issueType: "",
      description: "",
      resolution: "",
      files: [],
      callbackRequested: false,
      callbackPhone: "",
    });
    setPreviewFiles([]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === activeChat.id) {
        return {
          ...ticket,
          chat: [...ticket.chat, { sender: "user", text: chatMessage }],
        };
      }
      return ticket;
    });
    setTickets(updatedTickets);
    setChatMessage("");
  };

  return (
   <>
   <Header />
    <div className="container py-4 px-4 my-4 border border-gray rounded"> 
      <h2 className="text-center mb-4 text-black font-thin text-3xl " style ={{ textDecoration: "underline", textUnderlinePosition: "under" }}>
        Customer Complaints & Support Tickets
      </h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header  fw-bold">Submit a Complaint</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Order ID</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Issue Type</label>
                <select
                  className="form-select"
                  required
                  value={formData.issueType}
                  onChange={(e) =>
                    setFormData({ ...formData, issueType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {issueTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Issue Description</label>
              <textarea
                className="form-control"
                rows="3"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Preferred Resolution</label>
              <select
                className="form-select"
                required
                value={formData.resolution}
                onChange={(e) =>
                  setFormData({ ...formData, resolution: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Refund">Refund</option>
                <option value="Replacement">Replacement</option>
                <option value="Clarification">Clarification</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Proof</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleFileUpload}
              />
              <div className="mt-2 d-flex flex-wrap">
                {previewFiles.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Preview"
                    className="me-2 mb-2"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ))}
              </div>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="callbackSwitch"
                checked={formData.callbackRequested}
                onChange={(e) =>
                  setFormData({ ...formData, callbackRequested: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="callbackSwitch">
                Request a callback
              </label>
              {formData.callbackRequested && (
                <input
                  type="tel"
                  className="form-control mt-2"
                  placeholder="Your phone number"
                  value={formData.callbackPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, callbackPhone: e.target.value })
                  }
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              <FaPlus className="me-1" /> Submit Ticket
            </button>
          </form>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-light fw-bold">
          Your Submitted Tickets
        </div>
        <div className="card-body">
          {tickets.length === 0 ? (
            <p className="text-muted">No tickets submitted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-secondary">
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Issue</th>
                    <th>Resolution</th>
                    <th>Status</th>
                    <th>Estimated Resolution</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => (
                    <tr key={t.id}>
                      <td>{i + 1}</td>
                      <td>{t.orderId}</td>
                      <td>{t.issueType}</td>
                      <td>{t.resolution}</td>
                      <td>
                        <span className={`badge bg-${t.status === "Open" ? "warning" : "success"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <FaRegClock className="me-1" />
                        {t.estimatedResolution}
                      </td>
                      <td>{t.submittedAt}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setActiveChat(t)}
                        >
                          <MdChatBubble className="me-1" /> View Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Chat Box */}
      {activeChat && (
        <div className="card mt-4 border border-info">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <strong>Chat with Support - Ticket #{activeChat.id}</strong>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setActiveChat(null)}
            >
              Close
            </button>
          </div>
          <div className="card-body" style={{ maxHeight: "250px", overflowY: "auto" }}>
            {activeChat.chat.map((msg, i) => (
              <div key={i} className={`mb-2 text-${msg.sender === "user" ? "end" : "start"}`}>
                <span className={`badge bg-${msg.sender === "user" ? "primary" : "secondary"}`}>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button className="btn btn-info" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
   <Footer/>
   </>
  );
};

export default CustomerSupportTicketsPage;
