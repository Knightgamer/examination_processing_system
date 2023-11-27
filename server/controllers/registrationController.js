const Registration = require("../models/registrationModel");
const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");

// Helper function to count courses in a given year and semester for a student
const countCourses = async (studentId, academicYear, semester) => {
  const registrations = await Registration.find({
    student: studentId,
  }).populate({
    path: "courses",
    match: { academicYear: academicYear, semester: semester },
  });

  return registrations.reduce((acc, reg) => acc + reg.courses.length, 0);
};

// Register courses for a student
exports.registerCourses = asyncHandler(async (req, res) => {
  const { student, courses } = req.body;

  // Validate courses array
  if (!Array.isArray(courses) || courses.length === 0) {
    res.status(400);
    throw new Error("No courses provided for registration");
  }

  // Fetch course details to determine the semester and academic year
  const courseDetails = await Course.find({ _id: { $in: courses } });
  const academicYear = courseDetails[0].academicYear; // Assuming all courses belong to the same academic year
  const semester = courseDetails[0].semester; // Assuming all courses belong to the same semester

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
  const registration = await Registration.create({ student, courses });

  res.status(201).json(registration);
});

// Get registration for a student
exports.getRegistration = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const registration = await Registration.find({ student: studentId }).populate(
    {
      path: "courses",
      select: "courseName courseCode semester academicYear",
    }
  );

  if (!registration) {
    res.status(404);
    throw new Error("Registration not found");
  }

  res.status(200).json(registration);
});
