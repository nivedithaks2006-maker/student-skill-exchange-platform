const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

// Send a message
router.post("/send", sendMessage);

// Get conversation between two students
router.get("/:user1/:user2", getMessages);

module.exports = router;