// // ✅ Make sure it exports a function correctly
// const createContact = async (req, res) => {
//     try {
//       const { name, email, phone, message } = req.body;
  
//       if (!name || !email || !message) {
//         return res.status(400).json({ error: "Please fill all required fields." });
//       }
  
//       res.status(201).json({ message: "Contact received!" });
//     } catch (err) {
//       res.status(500).json({ error: "Server error" });
//     }
//   };
  
//   module.exports = { createContact };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const response = await fetch(`${API}/api/contact-page`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(form),
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       alert("Message submitted! We will contact you shortly.");
  //       setForm({ name: '', phone: '', email: '', subject: '', message: '' });
  //     } else {
  //       alert(data.error || "Failed to submit. Please try again later.");
  //     }
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     alert("Error submitting form. Try again later.");
  //   }
  // };


//   const Contact = require('../models/contactModel');

// exports.submitContact = async (req, res) => {
//   try {
//     const { name, phone, email, subject, message } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({ message: 'Required fields missing' });
//     }

//     const contact = new Contact({ name, phone, email, subject, message });
//     await contact.save();
//     res.status(201).json({ message: 'Contact submitted successfully' });
//   } catch (error) {
//     console.error('❌ MongoDB error:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const Contact = require("../models/contactModel");

exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Contact saved successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Failed to save contact", error });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("❌ Error fetching contacts:", error.message);
    res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update contact', error: err.message });
  }
};


exports.updateContactStatus = async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update contact', error: err.message });
  }
};
