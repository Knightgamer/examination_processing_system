// controllers/scoreController.js
const Score = require("../models/scoreModel");
const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel"); // assuming you have a course model
const Student = require("../models/userModel"); // assuming you have a student model

// Function to calculate the grade based on the score
const calculateGrade = (score) => {
  if (score >= 90) return "A";
  else if (score >= 87) return "A-";
  else if (score >= 84) return "B+";
  else if (score >= 80) return "B";
  else if (score >= 77) return "B-";
  else if (score >= 74) return "C+";
  else if (score >= 70) return "C";
  else if (score >= 67) return "C-";
  else if (score >= 64) return "D+";
  else if (score >= 62) return "D";
  else if (score >= 60) return "D-";
  else return "F";
};

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

  // Calculate the total score from assignment scores, cat scores, and exam score
  const totalScore =
    assignmentScores.reduce((acc, score) => acc + score.score, 0) +
    catScores.reduce((acc, score) => acc + score.score, 0) +
    examScore.score;

  // Calculate the grade based on the total score
  const grade = calculateGrade(totalScore);

  const scoreRecord = await Score.create({
    student,
    course,
    assignmentScores,
    catScores,
    examScore,
    specialConsideration,
    grade, // Store the calculated grade
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

  // Calculate the total score from assignment scores, cat scores, and exam score
  const totalScore =
    assignmentScores.reduce((acc, score) => acc + score.score, 0) +
    catScores.reduce((acc, score) => acc + score.score, 0) +
    examScore.score;

  // Calculate the grade based on the total score
  const grade = calculateGrade(totalScore);

  scoreRecord.assignmentScores = assignmentScores;
  scoreRecord.catScores = catScores;
  scoreRecord.examScore = examScore;
  scoreRecord.specialConsideration = specialConsideration;
  scoreRecord.grade = grade; // Update the grade
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

  res.status(200).json({
    _id: scoreRecord._id,
    student: scoreRecord.student,
    course: scoreRecord.course,
    assignmentScores: scoreRecord.assignmentScores,
    catScores: scoreRecord.catScores,
    examScore: scoreRecord.examScore,
    specialConsideration: scoreRecord.specialConsideration,
    grade: scoreRecord.grade, // Include the grade in the response
  });
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

  // Modify the response to include the grade for each score record
  const scoresWithGrades = scores.map((scoreRecord) => ({
    _id: scoreRecord._id,
    student: scoreRecord.student,
    course: scoreRecord.course,
    assignmentScores: scoreRecord.assignmentScores,
    catScores: scoreRecord.catScores,
    examScore: scoreRecord.examScore,
    specialConsideration: scoreRecord.specialConsideration,
    grade: scoreRecord.grade, // Include the grade in the response
  }));

  res.status(200).json(scoresWithGrades);
});
