// controllers/scoreController.js
const Score = require("../models/scoreModel");
const asyncHandler = require("express-async-handler");

// Add or update scores
exports.addOrUpdateScores = asyncHandler(async (req, res) => {
  const {
    student,
    course,
    assignmentScores,
    catScores,
    examScore,
    specialConsideration,
  } = req.body;

  // Check if the score record already exists
  let scoreRecord = await Score.findOne({ student, course });

  if (scoreRecord) {
    // Update existing score record
    scoreRecord.assignmentScores = assignmentScores;
    scoreRecord.catScores = catScores;
    scoreRecord.examScore = examScore;
    scoreRecord.specialConsideration = specialConsideration;
    await scoreRecord.save();
  } else {
    // Create a new score record
    scoreRecord = await Score.create({
      student,
      course,
      assignmentScores,
      catScores,
      examScore,
      specialConsideration,
    });
  }

  res.status(201).json(scoreRecord);
});

// Get scores for a student in a course
exports.getScores = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.params;

  const scoreRecord = await Score.findOne({
    student: studentId,
    course: courseId,
  });

  if (!scoreRecord) {
    res.status(404);
    throw new Error("Score record not found");
  }

  res.status(200).json(scoreRecord);
});
