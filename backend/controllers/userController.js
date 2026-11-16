const User = require("../models/User");

// ==========================
// Get All Students
// ==========================
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Student Profile
// ==========================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update Student Profile
// ==========================
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Search Students by Skill
// ==========================
const searchStudents = async (req, res) => {
  try {
    const { skill } = req.query;

    const students = await User.find({
      skillsOffered: {
        $regex: skill || "",
        $options: "i",
      },
    }).select("-password");

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getProfile,
  updateProfile,
  searchStudents,
};