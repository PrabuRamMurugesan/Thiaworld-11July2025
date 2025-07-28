const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  appointmentDate: String,
  appointmentTime: String,
  jewelleryInterest: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled', 'rescheduled', 'follow-up'],
    default: 'pending'
  },
  followUpDate: String,
  adminNote: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
