const express = require("express");
const router = express.Router();

// Import the functions from the controller
const {
  getContacts,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
// Define routes for different CRUD operations
router.route("/").get(getContacts).post(createContact);

router
  .route("/:id")
  .get(getContactById)
  .put(updateContactById)
  .delete(deleteContactById);

module.exports = router;
