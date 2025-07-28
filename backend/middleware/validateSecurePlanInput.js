// middleware/validateSecurePlanInput.js

const validateSecurePlanInput = (req, res, next) => {
    const { name, email, phone } = req.body;
  
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, Email and Phone are required.' });
    }
  
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be 10 digits.' });
    }
  
    const emailRegex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
  
    next(); // Pass control to the controller
  };
  
  module.exports = validateSecurePlanInput;
  