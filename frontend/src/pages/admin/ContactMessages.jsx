// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ContactMessages = () => {
//   const [contacts, setContacts] = useState([]);
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const contactsPerPage = 10;

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URI}/contact`);
//         setContacts(res.data);
//       } catch (err) {
//         console.error("Error loading contacts:", err);
//         setError("Failed to load contacts. Please try again later.");
//       }
//     };
//     fetchContacts();
//   }, []);

//   const filteredContacts = contacts.filter(c =>
//     c.name?.toLowerCase().includes(search.toLowerCase()) ||
//     c.email?.toLowerCase().includes(search.toLowerCase()) ||
//     c.subject?.toLowerCase().includes(search.toLowerCase())
//   );

//   const indexOfLast = currentPage * contactsPerPage;
//   const indexOfFirst = indexOfLast - contactsPerPage;
//   const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

//   const exportCSV = () => {
//     const csvRows = [
//       ["Name", "Phone", "Email", "Subject", "Message", "Date"],
//       ...contacts.map(c => [c.name, c.phone, c.email, c.subject, c.message, new Date(c.createdAt).toLocaleString()])
//     ];
//     const csvContent = csvRows.map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'contacts.csv';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">📥 Contact Submissions</h2>

//       {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

//       <input
//         type="text"
//         placeholder="Search by name, email or subject..."
//         className="w-full p-2 mb-4 border rounded"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <button onClick={exportCSV} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">Export CSV</button>

//       <table className="w-full table-auto border-collapse border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Phone</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Subject</th>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentContacts.map((c, index) => (
//             <tr key={index}>
//               <td className="border p-2">{c.name}</td>
//               <td className="border p-2">{c.phone}</td>
//               <td className="border p-2">{c.email}</td>
//               <td className="border p-2">{c.subject}</td>
//               <td className="border p-2">{new Date(c.createdAt).toLocaleString()}</td>
//               <td className="border p-2 space-x-2">
//                 <button
//                   className="bg-green-500 text-white px-2 py-1 rounded"
//                   onClick={() => window.open(`mailto:${c.email}`)}
//                 >Email</button>
//                 <button
//                   className="bg-teal-500 text-white px-2 py-1 rounded"
//                   onClick={() => window.open(`https://wa.me/${c.phone}`)}
//                 >WhatsApp</button>
//                 <button
//                   className="bg-indigo-500 text-white px-2 py-1 rounded"
//                   onClick={() => setSelectedMessage(c)}
//                 >View</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-4 flex justify-center space-x-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
//           <button
//             key={num}
//             onClick={() => setCurrentPage(num)}
//             className={`px-3 py-1 rounded ${currentPage === num ? 'bg-black text-white' : 'bg-gray-300'}`}
//           >{num}</button>
//         ))}
//       </div>

//       {selectedMessage && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-md w-[90%] md:w-[60%] lg:w-[40%]">
//             <h3 className="text-xl font-semibold mb-2">Full Message</h3>
//             <p><strong>From:</strong> {selectedMessage.name}</p>
//             <p><strong>Subject:</strong> {selectedMessage.subject}</p>
//             <p className="my-2 whitespace-pre-line">{selectedMessage.message}</p>
//             <div className="mt-4 text-right">
//               <button onClick={() => setSelectedMessage(null)} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactMessages;


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // const ContactMessages = () => {
// //   const [contacts, setContacts] = useState([]);

// //   useEffect(() => {
// //     axios.get(`${import.meta.env.VITE_API_URI}/contact`)
// //       .then(res => setContacts(res.data))
// //       .catch(err => console.error("Error loading contacts:", err));
// //   }, []);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">📥 Contact Form Submissions</h2>
// //       <table className="w-full table-auto border-collapse border border-gray-300">
// //         <thead className="bg-gray-100">
// //           <tr>
// //             <th className="border p-2">Name</th>
// //             <th className="border p-2">Phone</th>
// //             <th className="border p-2">Email</th>
// //             <th className="border p-2">Subject</th>
// //             <th className="border p-2">Message</th>
// //             <th className="border p-2">Date</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {contacts.map((c, index) => (
// //             <tr key={index}>
// //               <td className="border p-2">{c.name}</td>
// //               <td className="border p-2">{c.phone}</td>
// //               <td className="border p-2">{c.email}</td>
// //               <td className="border p-2">{c.subject}</td>
// //               <td className="border p-2">{c.message}</td>
// //               <td className="border p-2">{new Date(c.createdAt).toLocaleString()}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default ContactMessages;
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';

// // const ContactMessages = () => {
// //   const [contacts, setContacts] = useState([]);
// //   const [filtered, setFiltered] = useState([]);
// //   const [search, setSearch] = useState('');

// //   useEffect(() => {
// //     axios.get(`${import.meta.env.VITE_API_URI}/contact`)
// //       .then(res => {
// //         setContacts(res.data);
// //         setFiltered(res.data);
// //       })
// //       .catch(err => console.error("Error loading contacts:", err));
// //   }, []);

// //   useEffect(() => {
// //     const results = contacts.filter(c =>
// //       c.name.toLowerCase().includes(search.toLowerCase()) ||
// //       c.email.toLowerCase().includes(search.toLowerCase()) ||
// //       c.subject.toLowerCase().includes(search.toLowerCase())
// //     );
// //     setFiltered(results);
// //   }, [search, contacts]);

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-xl font-bold mb-4">📥 Contact Submissions</h2>

// //       <input
// //         type="text"
// //         placeholder="Search by name, email or subject..."
// //         className="w-full p-2 mb-4 border rounded"
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //       />

// //       <table className="w-full table-auto border-collapse border border-gray-300">
// //         <thead className="bg-gray-100">
// //           <tr>
// //             <th className="border p-2">Name</th>
// //             <th className="border p-2">Phone</th>
// //             <th className="border p-2">Email</th>
// //             <th className="border p-2">Subject</th>
// //             <th className="border p-2">Message</th>
// //             <th className="border p-2">Date</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {filtered.map((c, index) => (
// //             <tr key={index}>
// //               <td className="border p-2">{c.name}</td>
// //               <td className="border p-2">{c.phone}</td>
// //               <td className="border p-2">{c.email}</td>
// //               <td className="border p-2">{c.subject}</td>
// //               <td className="border p-2">{c.message}</td>
// //               <td className="border p-2">{new Date(c.createdAt).toLocaleString()}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default ContactMessages;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const ContactMessages = () => {
//   const [contacts, setContacts] = useState([]);
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [selectedFields, setSelectedFields] = useState({
//     name: true,
//     phone: true,
//     email: true,
//     subject: true,
//     message: true,
//     createdAt: true,
//   });
//   const [subjectFilter, setSubjectFilter] = useState('');
//   const [dateFilter, setDateFilter] = useState('');
//   const [replyStatus, setReplyStatus] = useState('');
//   const [notes, setNotes] = useState({});
//   const [flagged, setFlagged] = useState({});
//   const contactsPerPage = 10;

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await axios.get(`${import.meta.env.VITE_API_URI}/contact`);
//         setContacts(res.data);
//       } catch (err) {
//         console.error("Error loading contacts:", err);
//         setError("Failed to load contacts. Please try again later.");
//       }
//     };
//     fetchContacts();
//   }, []);

//   const filteredContacts = contacts.filter(c => {
//     const matchesSearch =
//       c.name?.toLowerCase().includes(search.toLowerCase()) ||
//       c.email?.toLowerCase().includes(search.toLowerCase()) ||
//       c.subject?.toLowerCase().includes(search.toLowerCase());
//     const matchesSubject = subjectFilter ? c.subject?.toLowerCase().includes(subjectFilter.toLowerCase()) : true;
//     const matchesDate = dateFilter ? new Date(c.createdAt).toISOString().split('T')[0] === dateFilter : true;
//     const matchesReply = replyStatus ? c.replyStatus === replyStatus : true;
//     return matchesSearch && matchesSubject && matchesDate && matchesReply;
//   });

//   const indexOfLast = currentPage * contactsPerPage;
//   const indexOfFirst = indexOfLast - contactsPerPage;
//   const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     const tableColumn = Object.keys(selectedFields).filter(key => selectedFields[key]);
//     const tableRows = contacts.map(c =>
//       tableColumn.map(field =>
//         field === 'createdAt' ? new Date(c[field]).toLocaleString() : c[field] || ''
//       )
//     );
//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//     });
//     doc.save('contacts.pdf');
//   };

//   const exportCSV = () => {
//     const header = Object.keys(selectedFields).filter(key => selectedFields[key]);
//     const csvRows = [
//       header.map(h => h.charAt(0).toUpperCase() + h.slice(1)),
//       ...contacts.map(c =>
//         header.map(field =>
//           field === 'createdAt' ? new Date(c[field]).toLocaleString() : c[field] || ''
//         )
//       )
//     ];
//     const csvContent = csvRows.map(e => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'contacts.csv';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const toggleFlag = (id) => {
//     setFlagged(prev => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">📥 Contact Submissions</h2>

//       {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

//       <input
//         type="text"
//         placeholder="Search..."
//         className="w-full p-2 mb-2 border rounded"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <div className="mb-4 flex flex-wrap gap-2">
//         <input
//           type="text"
//           placeholder="Filter by subject"
//           className="p-2 border rounded"
//           value={subjectFilter}
//           onChange={(e) => setSubjectFilter(e.target.value)}
//         />
//         <input
//           type="date"
//           className="p-2 border rounded"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//         />
//         <select className="p-2 border rounded" onChange={(e) => setReplyStatus(e.target.value)}>
//           <option value="">All Status</option>
//           <option value="Replied">Replied</option>
//           <option value="Pending">Pending</option>
//         </select>
//         <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">Export CSV</button>
//         <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
//       </div>

//       <table className="w-full table-auto border-collapse border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Phone</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Subject</th>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentContacts.map((c, index) => (
//             <tr key={index}>
//               <td className="border p-2">{c.name}</td>
//               <td className="border p-2">{c.phone}</td>
//               <td className="border p-2">{c.email}</td>
//               <td className="border p-2">{c.subject}</td>
//               <td className="border p-2">{new Date(c.createdAt).toLocaleString()}</td>
//               <td className="border p-2 space-x-2">
//                 <button
//                   className="bg-green-500 text-white px-2 py-1 rounded"
//                   onClick={() => window.open(`mailto:${c.email}`)}
//                 >Email</button>
//                 <button
//                   className="bg-teal-500 text-white px-2 py-1 rounded"
//                   onClick={() => window.open(`https://wa.me/${c.phone}`)}
//                 >WhatsApp</button>
//                 <button
//                   className="bg-indigo-500 text-white px-2 py-1 rounded"
//                   onClick={() => setSelectedMessage(c)}
//                 >View</button>
//                 <button
//                   className={`px-2 py-1 rounded ${flagged[c._id] ? 'bg-yellow-400' : 'bg-gray-300'}`}
//                   onClick={() => toggleFlag(c._id)}
//                 >{flagged[c._id] ? 'Unflag' : 'Flag'}</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="mt-4 flex justify-center space-x-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
//           <button
//             key={num}
//             onClick={() => setCurrentPage(num)}
//             className={`px-3 py-1 rounded ${currentPage === num ? 'bg-black text-white' : 'bg-gray-300'}`}
//           >{num}</button>
//         ))}
//       </div>

//       {selectedMessage && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-md w-[90%] md:w-[60%] lg:w-[40%]">
//             <h3 className="text-xl font-semibold mb-2">Full Message</h3>
//             <p><strong>From:</strong> {selectedMessage.name}</p>
//             <p><strong>Subject:</strong> {selectedMessage.subject}</p>
//             <p className="my-2 whitespace-pre-line">{selectedMessage.message}</p>
//             <div className="mt-4 text-right">
//               <button onClick={() => setSelectedMessage(null)} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactMessages;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ContactMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    phone: true,
    email: true,
    subject: true,
    message: true,
    createdAt: true,
  });
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [replyStatus, setReplyStatus] = useState('');
  const [flagged, setFlagged] = useState({});
  const [noteInputs, setNoteInputs] = useState({});
  const contactsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/contact`);
        setContacts(res.data);
      } catch (err) {
        console.error("Error loading contacts:", err);
        setError("Failed to load contacts. Please try again later.");
      }
    };
    fetchContacts();
  }, []);

  const handleUpdateContact = async (id, updates) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URI}/contact/${id}`, updates);
      setContacts(prev => prev.map(c => c._id === id ? res.data : c));
    } catch (err) {
      console.error("Error updating contact:", err);
    }
  };

  const toggleFlag = (id, currentFlag) => {
    handleUpdateContact(id, { flagged: !currentFlag });
  };

  const markAsReplied = (id) => {
    handleUpdateContact(id, { replyStatus: 'Replied' });
  };

  const saveNote = (id) => {
    const note = noteInputs[id] || '';
    handleUpdateContact(id, { adminNotes: note });
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter ? c.subject?.toLowerCase().includes(subjectFilter.toLowerCase()) : true;
    const matchesDate = dateFilter ? new Date(c.createdAt).toISOString().split('T')[0] === dateFilter : true;
    const matchesReply = replyStatus ? c.replyStatus === replyStatus : true;
    return matchesSearch && matchesSubject && matchesDate && matchesReply;
  });

  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = Object.keys(selectedFields).filter(key => selectedFields[key]);
    const tableRows = contacts.map(c =>
      tableColumn.map(field =>
        field === 'createdAt' ? new Date(c[field]).toLocaleString() : c[field] || ''
      )
    );
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });
    doc.save('contacts.pdf');
  };

  const exportCSV = () => {
    const header = Object.keys(selectedFields).filter(key => selectedFields[key]);
    const csvRows = [
      header.map(h => h.charAt(0).toUpperCase() + h.slice(1)),
      ...contacts.map(c =>
        header.map(field =>
          field === 'createdAt' ? new Date(c[field]).toLocaleString() : c[field] || ''
        )
      )
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📥 Contact Submissions</h2>

      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Filter by subject"
          className="p-2 border rounded"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <select className="p-2 border rounded" onChange={(e) => setReplyStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Replied">Replied</option>
          <option value="Pending">Pending</option>
        </select>
        <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded">Export CSV</button>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.map((c, index) => (
            <tr key={index}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.phone}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.subject}</td>
              <td className="border p-2">{new Date(c.createdAt).toLocaleString()}</td>
              <td className="border p-2 space-y-1 space-x-1">
                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => window.open(`mailto:${c.email}`)}>Email</button>
                <button className="bg-teal-500 text-white px-2 py-1 rounded" onClick={() => window.open(`https://wa.me/${c.phone}`)}>WhatsApp</button>
                <button className="bg-indigo-500 text-white px-2 py-1 rounded" onClick={() => setSelectedMessage(c)}>View</button>
                <button className={`px-2 py-1 rounded ${c.flagged ? 'bg-yellow-400' : 'bg-gray-300'}`} onClick={() => toggleFlag(c._id, c.flagged)}>{c.flagged ? 'Unflag' : 'Flag'}</button>
                <button className="bg-blue-400 text-white px-2 py-1 rounded" onClick={() => markAsReplied(c._id)}>Mark Replied</button>
                <div className="mt-1">
                  <input type="text" placeholder="Admin note..." className="p-1 border rounded w-full" value={noteInputs[c._id] || ''} onChange={(e) => setNoteInputs({ ...noteInputs, [c._id]: e.target.value })} />
                  <button className="bg-purple-500 text-white px-2 py-1 mt-1 rounded" onClick={() => saveNote(c._id)}>Save Note</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 rounded ${currentPage === num ? 'bg-black text-white' : 'bg-gray-300'}`}>{num}</button>
        ))}
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[90%] md:w-[60%] lg:w-[40%]">
            <h3 className="text-xl font-semibold mb-2">Full Message</h3>
            <p><strong>From:</strong> {selectedMessage.name}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject}</p>
            <p className="my-2 whitespace-pre-line">{selectedMessage.message}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setSelectedMessage(null)} className="bg-red-500 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
