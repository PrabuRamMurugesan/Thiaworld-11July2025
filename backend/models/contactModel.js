
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
 
 //Additional fields
 
  replyStatus: {
    type: String,
    enum: ['Pending', 'Replied'],
    default: 'Pending',
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  adminNotes: {
    type: String,
    default: '',
  },
  replyMessage: {
    type: String,
    default: '',
  },
  
  name: String,
  phone: String,
  email: String,
  subject: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contact', contactSchema);





