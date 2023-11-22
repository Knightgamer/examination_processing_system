const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
router.get("/", getAllUsers);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

// Delete user
router.delete("/user/:id", validateToken, deleteUser);
module.exports = router;
