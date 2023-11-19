const Grade = require("../models/gradesModel");

exports.createGrade = async (req, res) => {
  try {
    const newGrade = new Grade(req.body);
    await newGrade.save();
    res.status(201).send(newGrade);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find({}).populate("enrollment");
    res.status(200).send(grades);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate("enrollment");
    if (!grade) {
      return res.status(404).send();
    }
    res.send(grade);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!grade) {
      return res.status(404).send();
    }
    res.send(grade);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      return res.status(404).send();
    }
    res.send(grade);
  } catch (error) {
    res.status(500).send(error);
  }
};
