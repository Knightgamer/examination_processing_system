// controllers/registrationController.js
const Registration = require("../models/registrationModel");
const Course = require("../models/courseModel"); // Assuming you have a Course model
const asyncHandler = require("express-async-handler");

// Helper function to count courses in a given year and semester
const countCourses = async (studentId, academicYear, semester) => {
  const registrations = await Registration.find({
    student: studentId,
    academicYear,
    semester,
  });

  return registrations.reduce((acc, reg) => acc + reg.courses.length, 0);
};

// Register courses for a student
exports.registerCourses = asyncHandler(async (req, res) => {
  const { student, courses, semester, academicYear } = req.body;

  // Check if courses array is valid
  if (!Array.isArray(courses) || courses.length === 0) {
    res.status(400);
    throw new Error("No courses provided for registration");
  }

  // Count existing courses for the student in the given semester and academic year
  const existingCourseCount = await countCourses(
    student,
    academicYear,
    semester
  );

  // Check if adding new courses will exceed the limit
  if (existingCourseCount + courses.length > 5) {
    res.status(400);
    throw new Error("Exceeds maximum course limit for the semester");
  }

  // Count courses for the entire academic year
  const yearCourseCount = await countCourses(student, academicYear, null);
  if (yearCourseCount + courses.length > 10) {
    res.status(400);
    throw new Error("Exceeds maximum course limit for the academic year");
  }

  // Create registration record
  const registration = await Registration.create({
    student,
    courses,
    semester,
    academicYear,
  });

  res.status(201).json(registration);
});

// Get registration for a student
exports.getRegistration = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const registration = await Registration.find({ student: studentId }).populate(
    "courses"
  ); // Populate course details

  if (!registration) {
    res.status(404);
    throw new Error("Registration not found");
  }

  res.status(200).json(registration);
});
