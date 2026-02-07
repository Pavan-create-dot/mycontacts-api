const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");

const {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
} = require("../controllers/contactController");

// All routes are protected
router.use(validateToken);

// GET all contacts & CREATE new contact
router.route("/")
    .get(getContacts)
    .post(createContact);

// GET, UPDATE, DELETE single contact
router.route("/:id")
    .get(getContact)
    .put(updateContact)
    .delete(deleteContact);

module.exports = router;
