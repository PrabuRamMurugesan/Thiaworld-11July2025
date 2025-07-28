const Appointment = require('../models/appointmentModel');

exports.createAppointment = async (req, res) => {
  try {
    console.log('👉 Form Data:', req.body); // 🟢 DEBUGGING
    const appointment = new Appointment(req.body);
    const result = await appointment.save();
    console.log('✅ Saved to MongoDB:', result); // 🟢 DEBUGGING
    res.status(201).json({ message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(appointments);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};


exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, { status });
    res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    console.error('❌ Status update error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
};


exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, {
      appointmentDate,
      appointmentTime,
      status: 'rescheduled'
    });
    res.status(200).json({ message: 'Rescheduled successfully' });
  } catch (err) {
    console.error('❌ Reschedule error:', err);
    res.status(500).json({ error: 'Failed to reschedule' });
  }
};
exports.setFollowUpDate = async (req, res) => {
  try {
    const { followUpDate } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, {
      followUpDate,
      status: 'follow-up'
    });
    res.status(200).json({ message: 'Follow-up date set' });
  } catch (err) {
    console.error('❌ Follow-up error:', err);
    res.status(500).json({ error: 'Failed to set follow-up' });
  }
};
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error('❌ Deletion error:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
    