// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ViewAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
// const API = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     axios.get('${API}/api/appointments')
//       .then(res => setAppointments(res.data))
//       .catch(err => console.error('Error fetching:', err));
//   }, []);

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">All Appointments</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2 border">Name</th>
//               <th className="p-2 border">Email</th>
//               <th className="p-2 border">Phone</th>
//               <th className="p-2 border">City</th>
//             <th className="p-2 border">Date</th>
//               <th className="p-2 border">Time</th>
//               <th className="p-2 border">Interest</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((item, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 <td className="p-2 border">{item.name}</td>
//                 <td className="p-2 border">{item.email}</td>
//                 <td className="p-2 border">{item.phone}</td>
//                 <td className="p-2 border">{item.city}</td>
//                 <td className="p-2 border">{item.appointmentDate}</td>
//                 <td className="p-2 border">{item.appointmentTime}</td>
//                 <td className="p-2 border">{item.jewelleryInterest}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewAppointments;

import React, { useEffect, useState } from "react";
import axios from "axios";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [reschedule, setReschedule] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filteredAppointments = appointments.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAppointments.length / perPage);
  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    axios
      .get(`${API}/api/appointments`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching:", err));
  }, [refresh]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/api/appointments/${id}/status`, {
        status,
      });
      setRefresh(!refresh);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;
    try {
      await axios.delete(`${API}/api/appointments/${id}`);
      setRefresh(!refresh);
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  const submitReschedule = async () => {
    try {
      await axios.put(`${API}/api/appointments/${reschedule._id}/reschedule`, {
        appointmentDate: reschedule.newDate,
        appointmentTime: reschedule.newTime,
      });
      setReschedule(null);
      setRefresh(!refresh);
    } catch (err) {
      alert("Failed to reschedule");
    }
  };

  const submitFollowUp = async () => {
    try {
      await axios.put(`${API}/api/appointments/${followUp._id}/followup`, {
        followUpDate: followUp.followUpDate,
      });
      setFollowUp(null);
      setRefresh(!refresh);
    } catch (err) {
      alert("Failed to update follow-up");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(appointments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "appointments.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Appointments Report", 14, 10);
    const columns = [
      "Name",
      "Email",
      "Phone",
      "City",
      "Store",
      "Date",
      "Time",
      "Interest",
      "Status",
    ];
    const rows = appointments.map((a) => [
      a.name,
      a.email,
      a.phone,
      a.city,
      a.store,
      a.appointmentDate,
      a.appointmentTime,
      a.jewelleryInterest,
      a.status,
    ]);
    doc.autoTable({ head: [columns], body: rows, startY: 20 });
    doc.save("appointments.pdf");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📋 Manage Appointments</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Store</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Interest</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.email}</td>
                <td className="p-2 border">{item.phone}</td>
                <td className="p-2 border">{item.city}</td>
                <td className="p-2 border">{item.store}</td>
                <td className="p-2 border">{item.appointmentDate}</td>
                <td className="p-2 border">{item.appointmentTime}</td>
                <td className="p-2 border">{item.jewelleryInterest}</td>
                <td className="p-2 border capitalize">
                  {item.status || "pending"}
                </td>
                <td className="p-2 border space-y-1">
                  <button
                    onClick={() => updateStatus(item._id, "accepted")}
                    className="text-green-600 hover:underline block"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(item._id, "cancelled")}
                    className="text-red-600 hover:underline block"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setReschedule({ _id: item._id })}
                    className="text-yellow-600 hover:underline block"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setFollowUp({ _id: item._id })}
                    className="text-blue-600 hover:underline block"
                  >
                    Follow-Up
                  </button>
                  <button
                    onClick={() => deleteAppointment(item._id)}
                    className="text-gray-600 hover:underline block"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reschedule Modal */}
      {reschedule && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <h3 className="text-lg font-semibold mb-2">
              Reschedule Appointment
            </h3>
            <input
              type="date"
              onChange={(e) =>
                setReschedule((prev) => ({ ...prev, newDate: e.target.value }))
              }
              className="border w-full mb-2 px-2 py-1"
            />
            <input
              type="time"
              onChange={(e) =>
                setReschedule((prev) => ({ ...prev, newTime: e.target.value }))
              }
              className="border w-full mb-4 px-2 py-1"
            />
            <button
              onClick={submitReschedule}
              className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setReschedule(null)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Follow-Up Modal */}
      {followUp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <h3 className="text-lg font-semibold mb-2">Set Follow-Up Date</h3>
            <input
              type="date"
              onChange={(e) =>
                setFollowUp((prev) => ({
                  ...prev,
                  followUpDate: e.target.value,
                }))
              }
              className="border w-full mb-4 px-2 py-1"
            />
            <button
              onClick={submitFollowUp}
              className="bg-blue-500 text-white px-3 py-1 mr-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setFollowUp(null)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Add Export Buttons (above the table): */}

      <div className="flex justify-end gap-4 mb-4 p-5">
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Export Excel
        </button>
        <button
          onClick={exportToPDF}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Export PDF
        </button>
      </div>

      {/* Add Search Input + Pagination Controls:
🔍 Just above table: */}

      <div className="flex justify-between items-center mb-3">
        <div>
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            className="px-3 py-1 border rounded mr-2 disabled:opacity-40"
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            className="px-3 py-1 border rounded ml-2 disabled:opacity-40"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointments;
