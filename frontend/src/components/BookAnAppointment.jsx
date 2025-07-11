import React, { useState } from 'react';
import axios from 'axios';

const BookAnAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    appointmentDate: '',
    appointmentTime: '',
    jewelleryInterest: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/appointments', formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Book An Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input type="text" name="name" placeholder="Enter your name" onChange={handleChange} required className="input w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required className="input w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input type="tel" name="phone" placeholder="Enter phone number" onChange={handleChange} required className="input w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">City</label>
          <input type="text" name="city" placeholder="City" onChange={handleChange} required className="input w-full border px-3 py-2 rounded" />
        </div>
    
        <div>
          <label className="block font-medium">Appointment Date</label>
          <input type="date" name="appointmentDate" onChange={handleChange} required className="input w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Appointment Time</label>
          <input type="time" name="appointmentTime" onChange={handleChange} required className="input w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Jewellery Interest</label>
          <input type="text" name="jewelleryInterest" placeholder="What type of jewellery?" onChange={handleChange} className="input w-full border px-3 py-2 rounded" />
        </div>

        <button type="submit" className="bg-yellow-500 px-4 py-2 text-white rounded hover:bg-yellow-600">Book Now</button>
      </form>

      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
};

export default BookAnAppointment;
