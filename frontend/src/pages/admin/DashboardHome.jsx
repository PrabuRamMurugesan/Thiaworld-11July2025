import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const [counts, setCounts] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    goldRates: {},
  });

  const [latestOrders, setLatestOrders] = useState([]);
  const [latestCustomers, setLatestCustomers] = useState([]);

  useEffect(() => {
    fetchCounts();
    fetchLatest();
  }, []);

  const fetchCounts = async () => {
    const [products, orders, customers, goldRates] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URI}/api/products/count`),
      axios.get(`${import.meta.env.VITE_API_URI}/api/orders/count`),
      axios.get(`${import.meta.env.VITE_API_URI}/api/customers/count`),
      axios.get(`${import.meta.env.VITE_API_URI}/api/goldrate/latest`),
    ]);
    setCounts({
      products: products.data.count,
      orders: orders.data.count,
      customers: customers.data.count,
      goldRates: goldRates.data,
    });
  };

  const fetchLatest = async () => {
    const [orders, customers] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URI}/api/orders/latest`),
      axios.get(`${import.meta.env.VITE_API_URI}/api/customers/latest`),
    ]);
    setLatestOrders(orders.data);
    setLatestCustomers(customers.data);
  };

  return (
    <div className="container mt-4">
      <h2>🏠 Admin Dashboard</h2>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 text-center">
            <h4>Products</h4>
            <h2>{counts.products}</h2>
            <Link to="/admin/products">View All</Link>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center">
            <h4>Orders</h4>
            <h2>{counts.orders}</h2>
            <Link to="/admin/orders">View All</Link>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center">
            <h4>Customers</h4>
            <h2>{counts.customers}</h2>
            <Link to="/admin/customers">View All</Link>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center">
            <h4>Gold Rates</h4>
            <p>24K: ₹{counts.goldRates.k24}</p>
            <p>22K: ₹{counts.goldRates.k22}</p>
            <p>18K: ₹{counts.goldRates.k18}</p>
            <Link to="/admin/goldrate">Manage Rates</Link>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h5>Recent Orders</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.customerName}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <h5>Recent Customers</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {latestCustomers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardHome;
