import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await API.get(`/requests/${user._id}`);
      setRequests(res.data.requests);
    } catch (err) {
      console.log(err);
      alert("Unable to load requests");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/requests/${id}`, {
        status,
      });

      alert(res.data.message);
      loadRequests();
    } catch (err) {
      console.log(err);
      alert("Unable to update request");
    }
  };

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
          }}
        >
          <h1
            style={{
              color: "#2563eb",
              marginBottom: "30px",
            }}
          >
            📩 My Skill Exchange Requests
          </h1>

          {requests.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>No Requests Found</h2>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req._id}
                style={{
                  background: "white",
                  padding: "25px",
                  marginBottom: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ color: "#2563eb" }}>
                  👤 {req.sender?.name}
                </h2>

                <p>
                  <strong>📧 Email:</strong> {req.sender?.email}
                </p>

                <p>
                  <strong>🏫 Branch:</strong> {req.sender?.branch}
                </p>

                <p>
                  <strong>📚 Semester:</strong> {req.sender?.semester}
                </p>

                <p>
                  <strong>💡 Requested Skill:</strong> {req.skill}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        req.status === "Accepted"
                          ? "green"
                          : req.status === "Rejected"
                          ? "red"
                          : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {req.status}
                  </span>
                </p>

                {req.status === "Pending" && (
                  <div style={{ marginTop: "20px" }}>
                    <button
                      onClick={() =>
                        updateStatus(req._id, "Accepted")
                      }
                      style={{
                        background: "#22c55e",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        marginRight: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      ✅ Accept
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(req._id, "Rejected")
                      }
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

          <div style={{ marginTop: "30px" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "#6b7280",
                color: "white",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ⬅ Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Requests;