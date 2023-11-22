const StudentConstraint = require("../models/studentModal");

exports.createStudentConstraint = async (req, res) => {
  try {
    const newConstraint = new StudentConstraint(req.body);
    await newConstraint.save();
    res.status(201).send(newConstraint);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllStudentConstraints = async (req, res) => {
  try {
    const constraints = await StudentConstraint.find({}).populate("user");
    res.status(200).send(constraints);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getStudentConstraintById = async (req, res) => {
  try {
    const constraint = await StudentConstraint.findById(req.params.id).populate(
      "user"
    );
    if (!constraint) {
      return res.status(404).send();
    }
    res.send(constraint);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateStudentConstraint = async (req, res) => {
  try {
    const constraint = await StudentConstraint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!constraint) {
      return res.status(404).send();
    }
    res.send(constraint);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteStudentConstraint = async (req, res) => {
  try {
    const constraint = await StudentConstraint.findByIdAndDelete(req.params.id);
    if (!constraint) {
      return res.status(404).send();
    }
    res.send(constraint);
  } catch (error) {
    res.status(500).send(error);
  }
};
