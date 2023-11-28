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
  const { student, courses } = req.body; // Assuming courses is an array of { course: courseId, semester: semesterValue }

  if (!Array.isArray(courses) || courses.length === 0) {
    res.status(400);
    throw new Error("No courses provided for registration");
  }

  const existingRegistrations = await Registration.findOne({ student });
  const alreadyRegistered = existingRegistrations?.courses.some((rc) =>
    courses.some(
      (c) =>
        c.course.toString() === rc.course.toString() &&
        c.semester === rc.semester
    )
  );

  if (alreadyRegistered) {
    return res
      .status(400)
      .json({ message: "Course already registered for the selected semester" });
  }

  if (existingRegistrations) {
    existingRegistrations.courses.push(...courses);
    await existingRegistrations.save();
  } else {
    await Registration.create({ student, courses });
  }

  res.status(201).json({ message: "Courses registered successfully" });
});

// Fetch registration for a student
exports.getRegistration = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const registrations = await Registration.find({
    student: studentId,
  }).populate({
    path: "courses.course",
    select: "courseName courseCode semester academicYear lecturer",
    populate: {
      path: "lecturer",
      select: "name",
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

    const registrations = await Registration.find({
      "courses.course": courseId,
      "courses.semester": semester,
    }).populate("student", "name email");

    const students = registrations.flatMap((reg) =>
      reg.courses
        .filter(
          (c) => c.course.toString() === courseId && c.semester === semester
        )
        .map(() => reg.student)
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found for this course in the given semester",
      });
    }

    res.status(200).json(students);
  }
);
