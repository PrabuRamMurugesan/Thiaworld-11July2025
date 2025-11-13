// // D:\Medun\Thia\front-end\src\pages\admin\AdminLogin.jsx

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_URI}/admin/login`, {
//         email,
//         password,
//       });
//       localStorage.setItem('adminToken', res.data.token);
//       navigate('/view-appointments');
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="max-w-sm mx-auto p-6 bg-white shadow rounded mt-20">
//       <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
//       <form onSubmit={handleLogin} className="space-y-3">
//         <input
//           type="email"
//           placeholder="Admin Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Admin Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         />
//         <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
//           Login
//         </button>
//         {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;
