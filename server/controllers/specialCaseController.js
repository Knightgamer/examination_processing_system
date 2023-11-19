const SpecialCase = require("../models/specialCaseModel");

exports.createSpecialCase = async (req, res) => {
  try {
    const newSpecialCase = new SpecialCase(req.body);
    await newSpecialCase.save();
    res.status(201).send(newSpecialCase);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllSpecialCases = async (req, res) => {
  try {
    const specialCases = await SpecialCase.find({})
      .populate("user")
      .populate("course");
    res.status(200).send(specialCases);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getSpecialCaseById = async (req, res) => {
  try {
    const specialCase = await SpecialCase.findById(req.params.id)
      .populate("user")
      .populate("course");
    if (!specialCase) {
      return res.status(404).send();
    }
    res.send(specialCase);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateSpecialCase = async (req, res) => {
  try {
    const specialCase = await SpecialCase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!specialCase) {
      return res.status(404).send();
    }
    res.send(specialCase);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteSpecialCase = async (req, res) => {
  try {
    const specialCase = await SpecialCase.findByIdAndDelete(req.params.id);
    if (!specialCase) {
      return res.status(404).send();
    }
    res.send(specialCase);
  } catch (error) {
    res.status(500).send(error);
  }
};
