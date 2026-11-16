const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// Register Student
// =========================
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      branch,
      semester,
      skillsOffered,
      skillsWanted,
    } = req.body;

    console.log("Registration Request:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      branch,
      semester,
      skillsOffered,
      skillsWanted,
    });

    const userData = user.toObject();
    delete userData.password;

    console.log("Student Registered:", userData);

    res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      user: userData,
    });

  } catch (error) {
    console.log("Register Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Login Student
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Email:", email);

    // Show all users stored in DB
    const allUsers = await User.find();
    console.log("Users in Database:", allUsers);

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("User Found:", user.email);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user._id },
      "mysecretkey",
      { expiresIn: "1d" }
    );

    const userData = user.toObject();
    delete userData.password;

    console.log("Login Successful:", user.email);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: userData,
    });

  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};