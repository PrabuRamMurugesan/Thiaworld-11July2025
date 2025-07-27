import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaWhatsapp,
  FaEnvelope,
  FaRegClock,
  FaChartLine,
} from "react-icons/fa";
import { MdCampaign, MdSegment, MdOutlinePreview } from "react-icons/md";
import { AiOutlinePlus, AiOutlineSend } from "react-icons/ai";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const EmailWhatsAppMarketingPage = () => {
  const [campaign, setCampaign] = useState({
    name: "",
    channel: "email",
    segment: "all",
    subject: "",
    message: "",
    scheduledTime: "",
    previewVisible: false,
  });

  const [optInStatus, setOptInStatus] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSendCampaign = () => {
    if (!campaign.name || !campaign.subject || !campaign.message) {
      setStatusMsg("Please fill in all required fields.");
      return;
    }
    setCampaigns([...campaigns, campaign]);
    setStatusMsg("Campaign Scheduled/Launched Successfully!");
    setCampaign({
      name: "",
      channel: "email",
      segment: "all",
      subject: "",
      message: "",
      scheduledTime: "",
      previewVisible: false,
    });
  };

  const segments = [
    "All Users",
    "Abandoned Cart",
    "Inactive 30+ Days",
    "Wishlist Products",
    "High Spenders",
  ];

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2 className="text-center mb-4 xl:text-4xl">
          📢 Email & WhatsApp Marketing
        </h2>

        <div className="d-flex justify-content-between mb-3 gap-3">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <MdCampaign className="me-2" />
              Create New Campaign
            </div>
            <div className="card-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Campaign Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Festival Sale Blast"
                  value={campaign.name}
                  onChange={(e) =>
                    setCampaign({ ...campaign, name: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Choose Channel</label>
                <select
                  className="form-select"
                  value={campaign.channel}
                  onChange={(e) =>
                    setCampaign({ ...campaign, channel: e.target.value })
                  }
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Target Segment</label>
                <select
                  className="form-select"
                  value={campaign.segment}
                  onChange={(e) =>
                    setCampaign({ ...campaign, segment: e.target.value })
                  }
                >
                  {segments.map((s, i) => (
                    <option
                      key={i}
                      value={s.toLowerCase().replace(/\s+/g, "_")}
                    >
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Scheduled Time (optional)</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={campaign.scheduledTime}
                  onChange={(e) =>
                    setCampaign({ ...campaign, scheduledTime: e.target.value })
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">Subject / Message Header</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Don't Miss the 70% Off Deal!"
                  value={campaign.subject}
                  onChange={(e) =>
                    setCampaign({ ...campaign, subject: e.target.value })
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">Message Body</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Hey {user_name}, check out this offer on {product_name}..."
                  value={campaign.message}
                  onChange={(e) =>
                    setCampaign({ ...campaign, message: e.target.value })
                  }
                />
              </div>

              <div className="col-md-12 d-flex gap-2">
                <button
                  className="btn btn-success"
                  onClick={handleSendCampaign}
                >
                  <AiOutlineSend className="me-1" />
                  Send / Schedule
                </button>
                <button
                  className="btn btn-outline-dark"
                  onClick={() =>
                    setCampaign({
                      ...campaign,
                      previewVisible: !campaign.previewVisible,
                    })
                  }
                >
                  <MdOutlinePreview className="me-1" />
                  Preview
                </button>
              </div>
              {statusMsg && (
                <div className="text-success mt-2">{statusMsg}</div>
              )}
            </div>
          </div>

      

          <div className="d-flex  flex-wrap justify-content-between ">
            <div className="card mb-4 w-100">
              <div className="card-header bg-secondary text-white d-flex align-items-center">
                <FaChartLine className="me-2" />
                Recent Campaigns
              </div>
              <div className="card-body">
                <table className="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Channel</th>
                      <th>Segment</th>
                      <th>Scheduled Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{c.name}</td>
                        <td>{c.channel}</td>
                        <td>{c.segment}</td>
                        <td>{c.scheduledTime || "Now"}</td>
                      </tr>
                    ))}
                    {campaigns.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No campaigns launched yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card mb-4 w-100">
              <div className="card-header bg-light d-flex align-items-center">
                <MdSegment className="me-2 text-dark" />
                User Preferences
              </div>
              <div className="card-body">
                <p>Allow promotional messages to users who have opted-in:</p>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="optInSwitch"
                    checked={optInStatus}
                    onChange={() => setOptInStatus(!optInStatus)}
                  />
                  <label className="form-check-label" htmlFor="optInSwitch">
                    Promotional Email & WhatsApp Enabled
                  </label>
                </div>
              </div>
            </div>
          </div>
          
        </div>
            {campaign.previewVisible && (
            <div className="card mb-4">
              <div className="card-header bg-warning">
                <FaRegClock className="me-2" />
                Message Preview
              </div>
              <div className="card-body">
                <h5>
                  <strong>{campaign.subject}</strong>
                </h5>
                <p>{campaign.message}</p>
                <hr />
                <p>
                  <small>
                    Segment: {campaign.segment} | Channel: {campaign.channel}
                  </small>
                </p>
              </div>
            </div>
          )}
      </div>
      <Footer />
    </>
  );
};

export default EmailWhatsAppMarketingPage;
