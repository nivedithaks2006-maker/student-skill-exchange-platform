const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getProfile,
  updateProfile,
  searchStudents,
} = require("../controllers/userController");

// Get All Students
router.get("/", getAllStudents);

// Search Students by Skill
router.get("/search", searchStudents);

// Get Student Profile
router.get("/profile/:id", getProfile);

// Update Student Profile
router.put("/profile/:id", updateProfile);

module.exports = router;