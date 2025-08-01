import React, { useEffect, useState } from "react";
import axios from "axios";

const ComparePlanLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/compareplan/all`, {
        headers: {
          Authorization: "Bearer adminkey123", // secured admin middleware
        },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to fetch compare logs:", err));
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-yellow-700">📊 Compare Plan Logs</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-sm">
          <thead>
            <tr className="bg-yellow-100 text-yellow-800">
              <th className="border px-3 py-2">Plan Title</th>
              <th className="border px-3 py-2">Total Price</th>
              <th className="border px-3 py-2">Down Payment</th>
              <th className="border px-3 py-2">Tenure</th>
              <th className="border px-3 py-2">Rate (%)</th>
              <th className="border px-3 py-2">EMI</th>
              <th className="border px-3 py-2">Total Interest</th>
              <th className="border px-3 py-2">Total Payable</th>
              <th className="border px-3 py-2">Logged Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-yellow-50">
                <td className="border px-3 py-1">{log.planTitle}</td>
                <td className="border px-3 py-1">₹{log.totalPrice}</td>
                <td className="border px-3 py-1">₹{log.downPayment}</td>
                <td className="border px-3 py-1">{log.tenure}</td>
                <td className="border px-3 py-1">{log.interestRate}%</td>
                <td className="border px-3 py-1">₹{log.monthlyEMI}</td>
                <td className="border px-3 py-1">₹{log.totalInterest}</td>
                <td className="border px-3 py-1">₹{log.totalPayable}</td>
                <td className="border px-3 py-1">{new Date(log.viewedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePlanLogs;
