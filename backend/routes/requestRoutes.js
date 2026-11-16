const express = require("express");
const router = express.Router();

const {
  sendRequest,
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

// Send Skill Exchange Request
router.post("/send", sendRequest);

// Get All Requests for a Student
router.get("/:userId", getRequests);

// Accept / Reject Request
router.put("/:requestId", updateRequestStatus);

module.exports = router;