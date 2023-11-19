const Permission = require("../models/permissionModel");

exports.createPermission = async (req, res) => {
  try {
    const newPermission = new Permission(req.body);
    await newPermission.save();
    res.status(201).send(newPermission);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    res.status(200).send(permissions);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).send();
    }
    res.send(permission);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!permission) {
      return res.status(404).send();
    }
    res.send(permission);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) {
      return res.status(404).send();
    }
    res.send(permission);
  } catch (error) {
    res.status(500).send(error);
  }
};
