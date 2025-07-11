
const express = require("express");
const router = express.Router();


const {createContact, getAllContacts, updateContactStatus } = require("../controllers/contactcontroller");


router.post("/", createContact);
router.get("/", getAllContacts); // NEW: Get all contact messages
router.put('/:id', updateContactStatus);





module.exports = router;

