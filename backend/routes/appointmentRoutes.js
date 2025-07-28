const express = require('express');
const router = express.Router();
const { createAppointment , 
    getAllAppointments, updateAppointmentStatus,
    rescheduleAppointment,
    setFollowUpDate,
    deleteAppointment} = require('../controllers/appointmentController');

router.post('/appointments', createAppointment);
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.put('/appointments/:id/reschedule', rescheduleAppointment);
router.put('/appointments/:id/followup', setFollowUpDate);
router.delete('/appointments/:id', deleteAppointment);
module.exports = router;


