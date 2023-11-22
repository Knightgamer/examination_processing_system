const Enrollment = require("../models/enrollmentModel");

exports.createEnrollment = async (req, res) => {
  try {
    const newEnrollment = new Enrollment(req.body);
    await newEnrollment.save();
    res.status(201).send(newEnrollment);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({})
      .populate("user")
      .populate("course");
    res.status(200).send(enrollments);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("user")
      .populate("course");
    if (!enrollment) {
      return res.status(404).send();
    }
    res.send(enrollment);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return res.status(404).send();
    }
    res.send(enrollment);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).send();
    }
    res.send(enrollment);
  } catch (error) {
    res.status(500).send(error);
  }
};
