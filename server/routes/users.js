const router = require("express").Router();
const UserController = require("../controller/UserController");
const { userAuth, checkRole } = require("../utils/Auth");

// Unified User Registration Route
router.post("/register", UserController.register);

// Unified User Login Route
router.post("/login", UserController.login);

// Profile Route
router.get("/profile", userAuth, UserController.profile);

// Protected Route for Students
router.get(
  "/protected-student",
  userAuth,
  checkRole(["student"]),
  UserController.protectedStudent
);

// Protected Route for Lecturers
router.get(
  "/protected-lecturer",
  userAuth,
  checkRole(["lecturer"]),
  UserController.protectedLecturer
);

// Protected Route for Admins
router.get(
  "/protected-admin",
  userAuth,
  checkRole(["admin"]),
  UserController.protectedAdmin
);

module.exports = router;
