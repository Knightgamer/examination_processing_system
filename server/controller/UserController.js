const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser,
} = require("../utils/Auth");

class UserController {
  static async register(req, res) {
    const { role } = req.body;
    const validRoles = ["student", "lecturer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role provided.",
        success: false,
      });
    }
    await userRegister(req.body, role, res);
  }

  static async login(req, res) {
    try {
      await userLogin(req.body, res);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error.",
        success: false,
      });
    }
  }

  static async profile(req, res) {
    return res.json(serializeUser(req.user));
  }

  static async protectedStudent(req, res) {
    return res.json("Hello Student");
  }

  static async protectedLecturer(req, res) {
    return res.json("Hello Lecturer");
  }

  static async protectedAdmin(req, res) {
    return res.json("Hello Admin");
  }
}

module.exports = UserController;
