const LecturerCourse = require("../models/lecturerModel");

exports.assignLecturerToCourse = async (req, res) => {
  try {
    const newAssignment = new LecturerCourse(req.body);
    await newAssignment.save();
    res.status(201).send(newAssignment);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllLecturerCourseAssignments = async (req, res) => {
  try {
    const assignments = await LecturerCourse.find({})
      .populate("lecturer")
      .populate("course");
    res.status(200).send(assignments);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLecturerCourseAssignmentById = async (req, res) => {
  try {
    const assignment = await LecturerCourse.findById(req.params.id)
      .populate("lecturer")
      .populate("course");
    if (!assignment) {
      return res.status(404).send();
    }
    res.send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLecturerCourseAssignment = async (req, res) => {
  try {
    const assignment = await LecturerCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res.status(404).send();
    }
    res.send(assignment);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteLecturerCourseAssignment = async (req, res) => {
  try {
    const assignment = await LecturerCourse.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).send();
    }
    res.send(assignment);
  } catch (error) {
    res.status(500).send(error);
  }
};
