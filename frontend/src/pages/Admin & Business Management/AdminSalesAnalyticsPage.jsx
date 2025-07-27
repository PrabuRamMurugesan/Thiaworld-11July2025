import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// ✅ Simulated backend fetch with date filtering
const fetchSalesAnalytics = (range = "30D") =>
  new Promise((res) => {
    const allOrders = [
      {
        date: "2025-07-01",
        amount: 4500,
        vendor: "THIAWORLD",
        product: "Gold Ring",
        category: "Jewellery",
      },
      {
        date: "2025-06-29",
        amount: 3200,
        vendor: "SoundMax",
        product: "Earbuds",
        category: "Electronics",
      },
      {
        date: "2025-06-22",
        amount: 1700,
        vendor: "EthnoWear",
        product: "Saree",
        category: "Fashion",
      },
      {
        date: "2025-06-15",
        amount: 7200,
        vendor: "THIAWORLD",
        product: "Gold Chain",
        category: "Jewellery",
      },
      {
        date: "2025-06-10",
        amount: 3800,
        vendor: "SoundMax",
        product: "Speaker",
        category: "Electronics",
      },
      {
        date: "2025-05-15",
        amount: 5100,
        vendor: "EthnoWear",
        product: "Lehenga",
        category: "Fashion",
      },
    ];

    const now = new Date("2025-07-04"); // Mock current date for demo
    const daysMap = { "7D": 7, "30D": 30, "90D": 90, YTD: 365 };
    const daysBack = daysMap[range] || 30;

    const filteredOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.date);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      return diffDays <= daysBack;
    });

    res({
      orders: filteredOrders,
      refunds: [{ orderId: 2, amount: 1000 }],
      commissionRate: 10,
    });
  });

const AdminSalesAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30D");
  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchSalesAnalytics(range).then((data) => {
      setOrders(data.orders);
      setRefunds(data.refunds);

      const gross = data.orders.reduce((sum, o) => sum + o.amount, 0);
      const refundAmt = data.refunds.reduce((sum, r) => sum + r.amount, 0);
      const net = gross - refundAmt;
      const commission = (gross * data.commissionRate) / 100;
      const avgOrderValue = gross / data.orders.length || 0;

      setSummary({
        totalOrders: data.orders.length,
        grossRevenue: `₹${gross.toLocaleString()}`,
        netRevenue: `₹${net.toLocaleString()}`,
        refunds: `₹${refundAmt.toLocaleString()}`,
        avgOrderValue: `₹${avgOrderValue.toFixed(0)}`,
        commission: `₹${commission.toFixed(0)}`,
      });

      setLoading(false);
    });
  }, [range]);

  const groupBy = (key) => {
    return orders.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + item.amount;
      return acc;
    }, {});
  };

  const groupByDate = groupBy("date");
  const groupByCategory = groupBy("category");
  const groupByVendor = groupBy("vendor");
  const groupByProduct = groupBy("product");

  return (
    <>
      <Header />
      <div className="container my-4 border-2 border-black rounded p-5 shadow-s">
        <h2
          className="text-center mb-4 font-serif md:text-3xl"
          style={{ textDecoration: "underline" }}
        >
          Admin Sales & Revenue Analytics
        </h2>

        {/* Filters */}
        <div className="d-flex justify-content-between mb-3">
          <select
            className="form-select w-auto"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="90D">Last 90 Days</option>
            <option value="YTD">Year to Date</option>
          </select>
          <button className="btn btn-outline-primary">📤 Export Report</button>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          {Object.entries(summary).map(([k, v], i) => (
            <div className="col-md-2 mb-2" key={i}>
              <div className="card shadow-sm text-center p-2">
                <h6 className="small text-muted text-uppercase">
                  {k.replace(/([A-Z])/g, " $1")}
                </h6>
                <h5 className="fw-bold">{v}</h5>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-md-8 mb-4 ">
            <div className="card shadow-sm p-3 ">
              <h5 className="mb-3">📈 Revenue Trend</h5>
              <Line
                data={{
                  labels: Object.keys(groupByDate),
                  datasets: [
                    {
                      label: "Revenue (₹)",
                      data: Object.values(groupByDate),
                      fill: true,
                      backgroundColor: "rgba(75,192,192,0.2)",
                      borderColor: "#007bff",
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">🧁 Category Distribution</h5>
              <Doughnut
                data={{
                  labels: Object.keys(groupByCategory),
                  datasets: [
                    {
                      label: "Revenue by Category",
                      data: Object.values(groupByCategory),
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                      ],
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="row  ">
          <div className="col-md-6 mb-4  ">
            <div className="card shadow-sm p-3 ">
              <h5 className="mb-3">🏆 Top Vendors</h5>
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupByVendor)
                    .sort((a, b) => b[1] - a[1])
                    .map(([vendor, revenue], i) => (
                      <tr key={i}>
                        <td>{vendor}</td>
                        <td>₹{revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-6 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="mb-3">🔥 Top-Selling Products</h5>
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupByProduct)
                    .sort((a, b) => b[1] - a[1])
                    .map(([product, revenue], i) => (
                      <tr key={i}>
                        <td>{product}</td>
                        <td>₹{revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminSalesAnalyticsPage;
