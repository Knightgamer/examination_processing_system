const router = require("express").Router();
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser,
} = require("../utils/Auth");

// Unified User Registration Route
router.post("/register", async (req, res) => {
  const { role } = req.body;
  const validRoles = ["student", "lecturer", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role provided.",
      success: false,
    });
  }
  await userRegister(req.body, role, res);
});

// Unified User Login Route
router.post("/login", async (req, res) => {
  const { role } = req.body;
  const validRoles = ["student", "lecturer", "admin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role provided.",
      success: false,
    });
  }
  await userLogin(req.body, role, res);
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Protected Route for Students
router.get(
  "/protected-student",
  userAuth,
  checkRole(["student"]),
  async (req, res) => {
    return res.json("Hello Student");
  }
);

// Protected Route for Lecturers
router.get(
  "/protected-lecturer",
  userAuth,
  checkRole(["lecturer"]),
  async (req, res) => {
    return res.json("Hello Lecturer");
  }
);

// Protected Route for Admins
router.get(
  "/protected-admin",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

module.exports = router;
