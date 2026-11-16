const Message = require("../models/Message");

// ==========================
// Send Message
// ==========================
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({
        success: false,
        message: "Sender, receiver and message are required.",
      });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get Conversation
// ==========================
const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          receiver: user2,
        },
        {
          sender: user2,
          receiver: user1,
        },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};