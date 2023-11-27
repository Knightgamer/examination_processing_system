// controllers/reportController.js
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Score = require("../models/scoreModel");
const asyncHandler = require("express-async-handler");

// Helper functions (implement these based on your criteria for passing a course, etc.)
const didPassCourse = (scoreRecord) => {
  /* ... */
};
const isCourseFailed = (scoreRecord) => {
  /* ... */
};

// Report: Students who have passed all courses in a semester
exports.passedAllCoursesInSemester = asyncHandler(async (req, res) => {
  const { semester, academicYear } = req.query;
  const students = await User.find({ role: "student" });

  let passedAllStudents = [];

  for (let student of students) {
    const scores = await Score.find({ student: student._id });
    const semesterScores = scores.filter(
      (score) => score.course.semester === semester
    );

    if (semesterScores.length > 0 && semesterScores.every(didPassCourse)) {
      passedAllStudents.push(student);
    }
  }

  res.status(200).json(passedAllStudents);
});


// Report: Students who have passed all courses in a year
exports.passedAllCoursesInYear = asyncHandler(async (req, res) => {
  // Implement logic to find students who passed all courses in a given year
});

// Report: Students who have failed one or more courses in a semester
exports.failedAnyCourseInSemester = asyncHandler(async (req, res) => {
  // Implement logic to find students who failed any course in a given semester
});

// Report: Students who have failed one or more courses in a year
exports.failedAnyCourseInYear = asyncHandler(async (req, res) => {
  // Implement logic to find students who failed any course in a given year
});

// Report: Students with special considerations
exports.studentsWithSpecials = asyncHandler(async (req, res) => {
  const specialStudents = await Score.find({
    "specialConsideration.isApplicable": true,
  }).populate("student");
  res.status(200).json(specialStudents);
});

// Report: Students missing marks in at least one course
exports.studentsMissingMarks = asyncHandler(async (req, res) => {
  // Implement logic to find students missing marks in at least one course
});

// Report: Students missing marks in all registered courses
exports.studentsMissingAllMarks = asyncHandler(async (req, res) => {
  // Implement logic to find students missing marks in all registered courses
});

// Report: Students attempting a course for the second time
exports.studentsRetakingCourse = asyncHandler(async (req, res) => {
  // Implement logic to find students retaking a course
});
