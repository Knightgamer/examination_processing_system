// routes/registrationRoutes.js
const express = require("express");
const {
  registerCourses,
  getRegistration,
  getStudentsEnrolledInCourse,
  getStudentsEnrolledInCourseBySemester,
} = require("../controllers/registrationController");
const router = express.Router();

// Route to register courses for a student
router.post("/register", registerCourses);

// Route to get registration details for a student
router.get("/:studentId", getRegistration);

// Route to get students enrolled in a specific course
router.get("/:courseId/students", getStudentsEnrolledInCourse);

// Route to get students enrolled in a specific course for a specific semester
router.get(
  "/:courseId/semester/:semester/students",
  getStudentsEnrolledInCourseBySemester
);

module.exports = router;
