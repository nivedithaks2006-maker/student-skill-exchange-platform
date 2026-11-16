const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// ==========================
// Load Environment Variables
// ==========================
dotenv.config();

// ==========================
// Routes
// ==========================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const messageRoutes = require("./routes/messageRoutes");

// ==========================
// Create Express App
// ==========================
const app = express();

// ==========================
// Create HTTP Server
// ==========================
const server = http.createServer(app);

// ==========================
// Allowed Frontend Origins
// ==========================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://192.168.0.106:3000",
  "http://192.168.0.106:3001",
];

// ==========================
// CORS Middleware
// ==========================
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ==========================
// JSON Middleware
// ==========================
app.use(express.json());

// ==========================
// Socket.IO Configuration
// ==========================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ==========================
// API Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

// ==========================
// Test Route
// ==========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Student Skill Exchange Platform Backend is Running!",
  });
});

// ==========================
// Socket.IO Connection
// ==========================
io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // ==========================
  // Join Personal Chat Room
  // ==========================
  socket.on("join_chat", (userId) => {
    if (!userId) {
      console.log("⚠️ User ID missing while joining chat");
      return;
    }

    socket.join(userId);

    console.log(`👤 User ${userId} joined chat room`);
  });

  // ==========================
  // Send Real-Time Message
  // ==========================
  socket.on("send_message", (data) => {
    try {
      const { senderId, receiverId, message } = data;

      if (!senderId || !receiverId || !message) {
        console.log("⚠️ Invalid socket message data");
        return;
      }

      const newMessage = {
        senderId,
        receiverId,
        message,
        createdAt: new Date(),
      };

      // Send message to receiver
      io.to(receiverId).emit("receive_message", newMessage);

      console.log(
        `💬 Message sent from ${senderId} to ${receiverId}: ${message}`
      );
    } catch (error) {
      console.error("❌ Socket message error:", error);
    }
  });

  // ==========================
  // Disconnect
  // ==========================
  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});

// ==========================
// 404 Handler
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==========================
// Start Server After MongoDB
// ==========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Network access: http://192.168.0.106:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();