import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotificationsAlertsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState([
    { id: 1, type: "Price Drop", message: "Gold Necklace dropped ₹1,200", link: "/product/101" },
    { id: 2, type: "Flash Sale", message: "Ring on 50% off for 1 hour!", link: "/product/102" },
    { id: 3, type: "Restocked", message: "Bangle is back in stock", link: "/product/103" },
    { id: 4, type: "Order Update", message: "Your order #4567 has been shipped.", link: "/order/4567" },
  ]);

  const filteredAlerts = alerts.filter(alert =>
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="container mt-4 mb-5">
        <div className="card shadow rounded-4 p-4">
          <h4 className="text-center mb-4">🔔 Notifications & Alerts</h4>

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Alerts List */}
          <div
            className="alert-list"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "15px",
            }}
          >
            {filteredAlerts.length === 0 ? (
              <p className="text-muted text-center">No notifications found.</p>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="alert alert-light border d-flex justify-content-between align-items-center mb-3"
                >
                  <div>
                    <strong>{alert.type}:</strong> {alert.message}
                  </div>
                  <a href={alert.link} className="btn btn-sm btn-outline-primary">
                    View
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Manage Alerts Section */}
          <div className="mt-5">
            <h5 className="mb-3">🔧 Manage Your Alerts</h5>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" id="priceDrop" defaultChecked />
              <label className="form-check-label" htmlFor="priceDrop">
                Notify me about price drops
              </label>
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" id="flashSale" defaultChecked />
              <label className="form-check-label" htmlFor="flashSale">
                Notify me about flash sales
              </label>
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" id="restocked" defaultChecked />
              <label className="form-check-label" htmlFor="restocked">
                Notify me when items are restocked
              </label>
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" type="checkbox" id="orderUpdates" defaultChecked />
              <label className="form-check-label" htmlFor="orderUpdates">
                Notify me about order updates
              </label>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotificationsAlertsPage;
