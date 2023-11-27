// routes/registrationRoutes.js
const express = require("express");
const {
  registerCourses,
  getRegistration,
} = require("../controllers/registrationController");
const router = express.Router();

// Route to register courses for a student
router.post("/register", registerCourses);

// Route to get registration details for a student
router.get("/:studentId", getRegistration);

module.exports = router;
