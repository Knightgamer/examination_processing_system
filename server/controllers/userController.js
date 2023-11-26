const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route POST  /users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, name, role } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email, and password are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    name, // Add name if provided
    role, // Add role if provided
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc Login user
//@route POST  /users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });

  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id, // use _id for MongoDB's default ObjectId
          name: user.name,
          role: user.role, // Include the user's role
          // Include any other relevant fields here
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );

    // Include any additional user information you want to send in the response
    res.status(200).json({
      message: "Login successful",
      accessToken,
      userInfo: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        // other fields as needed
      },
    });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

//@desc Get all users with a specific role
//@route GET /users/role/:role
//@access private (assuming you want this route to be protected)
const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;

  // Validate the role parameter, you can add more role validation logic if needed
  if (!["student", "lecturer", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role parameter");
  }

  // Fetch users by role
  const users = await User.find({ role });

  res.status(200).json(users);
});

//@desc Get all users
//@route GET /users
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Excluding the password from the result
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@desc Current user info
//@route POST /users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne({ _id: user._id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUsersByRole,
  getAllUsers,
  deleteUser,
};
