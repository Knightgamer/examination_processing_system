const Course = require("../models/courseModel");
const asyncHandler = require("express-async-handler");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, semester, academicYear, lecturer } =
      req.body;

    // Check if a course with the same code, name, semester, and academic year already exists
    const existingCourse = await Course.findOne({
      courseCode,
      courseName,
      semester,
      academicYear,
    });

    if (existingCourse) {
      return res.status(400).json({
        error:
          "Course with the same code, name, semester, and academic year already exists.",
      });
    }

    const course = await Course.create({
      courseCode,
      courseName,
      semester,
      academicYear,
      lecturer,
    });
    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Could not create course" });
  }
};

// Get all courses with lecturer details populated
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Could not fetch courses" });
  }
};

// Get courses by a specific lecturer
const getCoursesByLecturer = asyncHandler(async (req, res) => {
  const { lecturerId } = req.params;

  try {
    const courses = await Course.find({ lecturer: lecturerId }).populate(
      "lecturer",
      "name"
    ); // Populate lecturer's name

    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this lecturer" });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by lecturer:", error);
    res.status(500).json({ error: "Could not fetch courses" });
    console.log(error);
  }
});

// Get a course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params; // Change "courseId" to "id"
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Could not fetch course" });
  }
};

// Update a course by ID
const updateCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Could not update course" });
  }
};

// Delete a course by ID
const deleteCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Could not delete course" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  getCoursesByLecturer,
};
