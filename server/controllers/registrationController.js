const Registration = require("../models/registrationModel");
const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

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
// Fetch students enrolled in a specific course
exports.getStudentsEnrolledInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  try {
    const registrations = await Registration.find({
      courses: { $in: [courseId] },
    }).populate({
      path: "student",
      select: "name email", // Adjust based on the fields you want
    });

    // Extract student details from registrations
    const students = registrations.map((reg) => reg.student);

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this course" });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students for the course:", error);
    res.status(500).json({ error: "Could not fetch students" });
  }
});

// Fetch students enrolled in a specific course for a specific semester
exports.getStudentsEnrolledInCourseBySemester = asyncHandler(
  async (req, res) => {
    const { courseId, semester } = req.params;

    try {
      const registrations = await Registration.find({
        "courses.course": courseId,
        "courses.semester": semester,
      }).populate("student", "name email");

      const students = registrations
        .filter((reg) =>
          reg.courses.some(
            (courseReg) =>
              courseReg.course.toString() === courseId &&
              courseReg.semester === semester
          )
        )
        .map((reg) => reg.student);

      if (students.length === 0) {
        return res.status(404).json({
          message: "No students found for this course in the given semester",
        });
      }

      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Could not fetch students" });
    }
  }
);
