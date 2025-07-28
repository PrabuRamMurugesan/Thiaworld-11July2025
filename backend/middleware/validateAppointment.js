module.exports = function validateAppointment(req, res, next) {
    const {
      name, email, phone,
      city, appointmentDate,
      appointmentTime
    } = req.body;
  
    if (!name || !email || !phone || !city || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }
  
    // Basic email and phone check
    if (!email.includes('@') || phone.length < 8) {
      return res.status(400).json({ error: 'Invalid email or phone number.' });
    }
  
    next();
  };
  