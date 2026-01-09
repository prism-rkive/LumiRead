import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, username, number } = req.body;

  if (!name || !password || !username) {
    return res.json({ status: false, type: "empty" });
  }

  const generatedEmail = email || `${username}@example.com`;

  // Check if username exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.json({ status: false, type: "username" });
  }

  // Check if number exists (if number is provided)
  if (number) {
    const numberExists = await User.findOne({ number });
    if (numberExists) {
      return res.json({ status: false, type: "number" });
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  try {
    const user = await User.create({
      name,
      email: generatedEmail,
      username,
      number,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
        status: true,
      });
    } else {
      res.json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      res.status(500).json({ status: false, error: error.message });
    } else {
      res.status(500).json({ status: false, error: error.message });
    }
  }
};

// @desc    Authenticate a user
// @route   POST /api/user/login
// @access  Public
export const authUser = async (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", { username, passwordProvided: !!password });

  const user = await User.findOne({ username });

  console.log("User found:", user ? user.username : "No user");

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: generateToken(user._id),
      status: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
};

// @desc    Get user profile
// @route   GET /api/user/me
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  res.json({
    status: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      age: user.age,
      readingGoals: user.readingGoals,
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.bio = req.body.bio || user.bio;
    user.age = req.body.age || user.age;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      age: updatedUser.age,
      token: generateToken(updatedUser._id),
      status: true,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Check auth status (Legacy support)
// @route   POST /api/user/isAuthed
// @access  Private
export const isAuthed = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({ auth_status: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      return res.json({ auth_status: true, user: decoded });
    }
  } catch (error) {
    return res.json({ auth_status: false });
  }
};
