const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  getUsersByRole, // Import the new controller for fetching users by role
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.get("/", getAllUsers);
// Add the new route to fetch users by role
router.get("/role/:role", getUsersByRole);
router.delete("/:id", deleteUser);

module.exports = router;
