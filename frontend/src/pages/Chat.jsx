import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import socket from "../services/socket";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const otherUser = location.state?.student;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Load old messages from MongoDB
  const loadMessages = useCallback(async () => {
    if (!currentUser?._id || !otherUser?._id) return;

    try {
      setLoading(true);

      const res = await API.get(
        `/messages/${currentUser._id}/${otherUser._id}`
      );

      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Load messages error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load messages"
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id, otherUser?._id]);

  // Setup Socket.IO
  useEffect(() => {
    if (!currentUser?._id || !otherUser?._id) return;

    // Join current user's room
    socket.emit("join_chat", currentUser._id);

    // Load previous messages
    loadMessages();

    // Receive new message
    const handleReceiveMessage = (newMessage) => {
      if (
        newMessage.senderId === otherUser._id ||
        newMessage.sender?._id === otherUser._id
      ) {
        setMessages((prev) => {
          // Prevent duplicate messages
          const alreadyExists = prev.some(
            (msg) =>
              msg._id &&
              newMessage._id &&
              msg._id === newMessage._id
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, newMessage];
        });
      }
    };

    socket.on(
      "receive_message",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receive_message",
        handleReceiveMessage
      );
    };
  }, [
    currentUser?._id,
    otherUser?._id,
    loadMessages,
  ]);

  // Scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    if (!currentUser?._id || !otherUser?._id) {
      alert("User information is missing");
      return;
    }

    try {
      setSending(true);

      // Save message in MongoDB
      const res = await API.post("/messages/send", {
        sender: currentUser._id,
        receiver: otherUser._id,
        message: trimmedMessage,
      });

      const savedMessage =
        res.data.data || res.data.message;

      // Add message to sender's screen
      if (savedMessage) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) =>
              msg._id &&
              savedMessage._id &&
              msg._id === savedMessage._id
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, savedMessage];
        });
      }

      // Send real-time message to receiver
      socket.emit("send_message", {
        senderId: currentUser._id,
        receiverId: otherUser._id,
        message: trimmedMessage,
      });

      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // Allow Enter to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  // Chat opened without selecting a student
  if (!otherUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f6f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2>💬 Chat unavailable</h2>

          <p>
            Please select a student from the
            Search Students page.
          </p>

          <button
            onClick={() => navigate("/search")}
            style={buttonStyle}
          >
            🔍 Find Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "30px 15px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "750px",
          maxWidth: "100%",
          height: "650px",
          margin: "0 auto",
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              💬 {otherUser.name}
            </h2>

            <small>
              {otherUser.branch || "Student"}
              {" • "}
              Semester {otherUser.semester || "-"}
            </small>
          </div>

          <button
            onClick={() => navigate("/search")}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.4)",
              padding: "8px 12px",
              borderRadius: "7px",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "#f8fafc",
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                marginTop: "30px",
              }}
            >
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#777",
                marginTop: "100px",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "10px",
                }}
              >
                💬
              </div>

              <h3>Start a conversation</h3>

              <p>
                Send a message to {otherUser.name}
                {" "}and start learning together! 🎓
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const senderId =
                msg.sender?._id ||
                msg.senderId?.toString();

              const isMine =
                senderId?.toString() ===
                currentUser?._id?.toString();

              return (
                <div
                  key={msg._id || index}
                  style={{
                    display: "flex",
                    justifyContent: isMine
                      ? "flex-end"
                      : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      minWidth: "60px",
                    }}
                  >
                    <div
                      style={{
                        padding: "11px 15px",
                        borderRadius: isMine
                          ? "15px 15px 3px 15px"
                          : "15px 15px 15px 3px",
                        background: isMine
                          ? "#2563eb"
                          : "#e5e7eb",
                        color: isMine
                          ? "white"
                          : "#111827",
                        wordBreak: "break-word",
                        fontSize: "15px",
                        lineHeight: "1.4",
                      }}
                    >
                      {msg.message}
                    </div>

                    {msg.createdAt && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "4px",
                          textAlign: isMine
                            ? "right"
                            : "left",
                          color: "#9ca3af",
                          fontSize: "10px",
                        }}
                      >
                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            gap: "10px",
            padding: "15px",
            borderTop: "1px solid #e5e7eb",
            background: "white",
          }}
        >
          <input
            type="text"
            placeholder={`Message ${otherUser.name}...`}
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            disabled={sending}
            style={{
              flex: 1,
              padding: "13px 15px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              outline: "none",
              fontSize: "15px",
            }}
          />

          <button
            type="submit"
            disabled={sending || !message.trim()}
            style={{
              background:
                sending || !message.trim()
                  ? "#9ca3af"
                  : "#2563eb",
              color: "white",
              border: "none",
              padding: "0 22px",
              borderRadius: "10px",
              cursor:
                sending || !message.trim()
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
            }}
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Chat;