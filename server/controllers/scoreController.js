// controllers/scoreController.js
const Score = require("../models/scoreModel");
const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel"); // assuming you have a course model
const Student = require("../models/userModel"); // assuming you have a student model

// Add new score
exports.createScore = asyncHandler(async (req, res) => {
  const {
    student,
    course,
    assignmentScores,
    catScores,
    examScore,
    specialConsideration,
  } = req.body;

  const studentExists = await Student.findById(student);
  const courseExists = await Course.findById(course);
  if (!studentExists || !courseExists) {
    res.status(404);
    throw new Error("Student or Course not found");
  }

  const scoreRecord = await Score.create({
    student,
    course,
    assignmentScores,
    catScores,
    examScore,
    specialConsideration,
  });

  res.status(201).json(scoreRecord);
});

// Update existing score
exports.updateScore = asyncHandler(async (req, res) => {
  const {
    student,
    course,
    assignmentScores,
    catScores,
    examScore,
    specialConsideration,
  } = req.body;

  const scoreRecord = await Score.findOne({ student, course });

  if (!scoreRecord) {
    res.status(404);
    throw new Error("Score record not found");
  }

  scoreRecord.assignmentScores = assignmentScores;
  scoreRecord.catScores = catScores;
  scoreRecord.examScore = examScore;
  scoreRecord.specialConsideration = specialConsideration;
  await scoreRecord.save();

  res.status(200).json(scoreRecord);
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

// Get all scores in the database
exports.getAllScores = asyncHandler(async (req, res) => {
  const scores = await Score.find()
    .populate({
      path: "student",
      select: "name", // Add other student fields as needed
    })
    .populate({
      path: "course",
      select: "courseCode courseName academicYear semester _id", // Include _id for courseId
      populate: {
        path: "lecturer",
        select: "name", // Add other lecturer fields as needed
      },
    })
    // Add other fields to populate if needed
    .populate("assignmentScores")
    .populate("catScores")
    .populate("examScore")
    .populate("specialConsideration");

  res.status(200).json(scores);
});
