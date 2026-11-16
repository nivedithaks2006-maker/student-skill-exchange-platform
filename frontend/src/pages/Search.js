import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Search() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const res = await API.get("/users");
      setStudents(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load students");
    }
  };

  const sendRequest = async (receiverId, skill) => {
    try {
      const res = await API.post("/requests/send", {
        sender: currentUser._id,
        receiver: receiverId,
        skill,
      });

      alert(res.data.message);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Request Failed"
      );
    }
  };

  const openChat = (student) => {
    navigate("/chat", {
      state: {
        student,
      },
    });
  };

  const filteredStudents = students.filter((student) => {
    if (student._id === currentUser?._id) {
      return false;
    }

    const name =
      student.name?.toLowerCase() || "";

    const branch =
      student.branch?.toLowerCase() || "";

    const skills =
      student.skillsOffered
        ?.join(" ")
        .toLowerCase() || "";

    const searchText = search.toLowerCase();

    return (
      name.includes(searchText) ||
      branch.includes(searchText) ||
      skills.includes(searchText)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <h1 style={{ color: "#2563eb" }}>
          🔍 Search Students
        </h1>

        <p>
          Find students based on their skills,
          branch or name.
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, branch or skill..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "14px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
            marginBottom: "30px",
          }}
        />

        {/* Students */}
        {filteredStudents.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>No students found</h3>
            <p>
              Try searching for another name,
              branch or skill.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student._id}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "20px",
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h2>{student.name}</h2>

              <p>
                <strong>📧 Email:</strong>{" "}
                {student.email}
              </p>

              <p>
                <strong>🏫 Branch:</strong>{" "}
                {student.branch}
              </p>

              <p>
                <strong>📚 Semester:</strong>{" "}
                {student.semester}
              </p>

              <p>
                <strong>💡 Skills Offered:</strong>
              </p>

              <div style={{ marginBottom: "15px" }}>
                {student.skillsOffered?.map(
                  (skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "7px 12px",
                        borderRadius: "20px",
                        marginRight: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              <p>
                <strong>🎯 Skills Wanted:</strong>
              </p>

              <div style={{ marginBottom: "20px" }}>
                {student.skillsWanted?.map(
                  (skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        background: "#dbeafe",
                        color: "#1e40af",
                        padding: "7px 12px",
                        borderRadius: "20px",
                        marginRight: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    sendRequest(
                      student._id,
                      student.skillsOffered?.[0]
                    )
                  }
                  style={{
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  🤝 Send Exchange Request
                </button>

                <button
                  onClick={() =>
                    openChat(student)
                  }
                  style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  💬 Chat
                </button>

                <button
                  onClick={() =>
                    alert(
                      "📹 Video calling will be available soon!"
                    )
                  }
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    border: "none",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  📹 Video Call
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;