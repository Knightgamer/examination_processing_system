// routes/scoreRoutes.js
const express = require("express");
const {
  createScore,
  getScores,
  updateScore,
  getAllScores,
} = require("../controllers/scoreController");
const router = express.Router();

// Route to add a new score
router.post("/", createScore);

// Route to update an existing score
router.put("/:studentId/:courseId", updateScore);

// Route to get scores for a student in a course
router.get("/:studentId/:courseId", getScores);
// Route to get all scores in the database
router.get("/", getAllScores);

module.exports = router;
