// routes/scoreRoutes.js
const express = require("express");
const {
  addOrUpdateScores,
  getScores,
} = require("../controllers/scoreController");
const router = express.Router();

// Route to add or update scores
router.post("/", addOrUpdateScores);

// Route to get scores for a student in a course
router.get("/:studentId/:courseId", getScores);

module.exports = router;
