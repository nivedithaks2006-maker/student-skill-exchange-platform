const Request = require("../models/Request");

// Send Skill Exchange Request
const sendRequest = async (req, res) => {
  try {
    const { sender, receiver, skill } = req.body;

    // Check if a similar pending request already exists
    const existingRequest = await Request.findOne({
      sender,
      receiver,
      skill,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent.",
      });
    }

    const request = await Request.create({
      sender,
      receiver,
      skill,
    });

    res.status(201).json({
      success: true,
      message: "Skill Exchange Request Sent Successfully",
      request,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// View Requests for a Student
const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.params.userId,
    })
      .populate("sender", "name email branch semester")
      .populate("receiver", "name email");

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Request Status
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Accepted or Rejected.",
      });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Request ${status}`,
      request,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendRequest,
  getRequests,
  updateRequestStatus,
};