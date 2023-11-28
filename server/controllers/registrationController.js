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

  // Check if the student has already registered for any of the selected courses in the same academic year and semester
  const existingRegistrations = await Registration.findOne({
    student,
    academicYear,
    semester,
  });
  if (existingRegistrations) {
    const alreadyRegisteredCourses = existingRegistrations.courses.map(
      (course) => course.toString()
    );
    const isAlreadyRegistered = courses.some((courseId) =>
      alreadyRegisteredCourses.includes(courseId)
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({
        message:
          "You have already registered for one or more selected courses in this semester.",
      });
    }
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

  const registrations = await Registration.find({
    student: studentId,
  }).populate({
    path: "courses",
    select: "courseName courseCode semester academicYear lecturer",
    populate: {
      path: "lecturer",
      select: "name", // Adjust the fields based on your User model
    },
  });

  if (registrations.length === 0) {
    return res.status(404).json({ message: "Registration not found" });
  }

  res.status(200).json(registrations);
});
