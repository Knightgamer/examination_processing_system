const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc Register a new user
// @route POST /users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  if (!username || !firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

// @desc Authenticate a user & get token
// @route POST /users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          id: user._id, // Ensure you're using _id, which is the actual property name in MongoDB
          role: user.role, // Make sure the 'role' field exists in your user model
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Send back the user object along with the access token
    res.status(200).json({
      accessToken,
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role, // Again, ensure the 'role' field exists and is populated
      },
    });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check for user - ensure the logged in user matches the user to be deleted
  if (user.id !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await user.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc Get current user
// @route GET /users/me
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser, deleteUser };
