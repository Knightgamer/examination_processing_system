const express = require("express");
const router = express.Router();
const lecturerCourseController = require("../controllers/lecturerController");

router.post("/", lecturerCourseController.assignLecturerToCourse);
router.get("/", lecturerCourseController.getAllLecturerCourseAssignments);
router.get("/:id", lecturerCourseController.getLecturerCourseAssignmentById);
router.put("/:id", lecturerCourseController.updateLecturerCourseAssignment);
router.delete("/:id", lecturerCourseController.deleteLecturerCourseAssignment);

module.exports = router;
