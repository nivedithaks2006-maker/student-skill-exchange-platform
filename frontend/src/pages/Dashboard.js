import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import socket from "../services/socket";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Connect current student to Socket.IO
  useEffect(() => {
    if (!user?._id) return;

    // Connect
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", socket.id);

      // Tell backend which student is online
      socket.emit("user-online", user._id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.IO");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [user?._id]);

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#f4f6f9",
          minHeight: "100vh",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
            background: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <h1
            style={{
              color: "#2563eb",
              marginBottom: "10px",
            }}
          >
            🎓 Student Dashboard
          </h1>

          <hr />

          <h2 style={{ marginTop: "25px" }}>
            Welcome, {user?.name} 👋
          </h2>

          {/* Student Information */}
          <div
            style={{
              marginTop: "25px",
              lineHeight: "2",
              fontSize: "18px",
            }}
          >
            <p>
              <strong>📧 Email:</strong> {user?.email}
            </p>

            <p>
              <strong>🏫 Branch:</strong> {user?.branch}
            </p>

            <p>
              <strong>📚 Semester:</strong> {user?.semester}
            </p>

            <p>
              <strong>💡 Skills Offered:</strong>
            </p>

            <div style={{ marginBottom: "20px" }}>
              {user?.skillsOffered?.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "#22c55e",
                    color: "white",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    marginRight: "10px",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <p>
              <strong>🎯 Skills Wanted:</strong>
            </p>

            <div>
              {user?.skillsWanted?.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    marginRight: "10px",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <hr style={{ margin: "30px 0" }} />

          {/* Navigation Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/search")}
              style={buttonStyle}
            >
              🔍 Search Students
            </button>

            <button
              onClick={() => navigate("/requests")}
              style={buttonStyle}
            >
              📩 Requests
            </button>

            <button
              onClick={() => navigate("/profile")}
              style={buttonStyle}
            >
              👤 Profile
            </button>

            {/* NEW CHAT BUTTON */}
            <button
              onClick={() => navigate("/chat")}
              style={{
                ...buttonStyle,
                background: "#16a34a",
              }}
            >
              💬 Chat
            </button>

            {/* NEW VIDEO CALL BUTTON */}
            <button
              onClick={() => navigate("/video-call")}
              style={{
                ...buttonStyle,
                background: "#7c3aed",
              }}
            >
              📹 Video Call
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              style={{
                ...buttonStyle,
                background: "#ef4444",
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* Communication Section */}
          <div
            style={{
              marginTop: "35px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3>🤝 Connect With Students</h3>

            <p style={{ color: "#64748b" }}>
              Exchange knowledge, communicate with other students,
              and learn new skills together.
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/chat")}
                style={{
                  ...buttonStyle,
                  background: "#16a34a",
                }}
              >
                💬 Start Chatting
              </button>

              <button
                onClick={() => navigate("/video-call")}
                style={{
                  ...buttonStyle,
                  background: "#7c3aed",
                }}
              >
                📹 Start Video Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

export default Dashboard;