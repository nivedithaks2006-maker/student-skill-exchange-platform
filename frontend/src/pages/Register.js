import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    semester: "",
    skillsOffered: "",
    skillsWanted: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMessage("");
    setSuccessMessage("");
  };

  const convertSkillsToArray = (skills) => {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!formData.branch.trim()) {
      setErrorMessage("Please enter your branch.");
      return;
    }

    if (!formData.semester.trim()) {
      setErrorMessage("Please enter your semester.");
      return;
    }

    const semesterNumber = Number(formData.semester);

    if (semesterNumber < 1 || semesterNumber > 12) {
      setErrorMessage("Semester must be between 1 and 12.");
      return;
    }

    const data = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      branch: formData.branch.trim(),
      semester: semesterNumber,
      skillsOffered: convertSkillsToArray(formData.skillsOffered),
      skillsWanted: convertSkillsToArray(formData.skillsWanted),
    };

    console.log("Sending registration data:", {
      ...data,
      password: "********",
    });

    setLoading(true);

    try {
      const response = await API.post("/auth/register", data);

      console.log("Registration response:", response.data);

      if (response.data.success) {
        setSuccessMessage(
          "Registration successful! 🎉 Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setErrorMessage(
          response.data.message || "Registration failed."
        );
      }
    } catch (error) {
      console.error("========== REGISTRATION ERROR ==========");
      console.error("Error:", error);
      console.error("Response:", error.response);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      console.error("========================================");

      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            "Server rejected the registration."
        );
      } else if (error.request) {
        setErrorMessage(
          "Cannot connect to the backend server. Make sure your backend is running on port 5000."
        );
      } else {
        setErrorMessage(
          error.message || "Unable to register. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* Header */}
        <div style={headerStyle}>
          <div style={logoStyle}>🎓</div>

          <h1 style={titleStyle}>
            Create Account
          </h1>

          <p style={subtitleStyle}>
            Join the Student Skill Exchange
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div style={errorStyle}>
            <span>❌</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={successStyle}>
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ================= PERSONAL INFORMATION ================= */}

          <div style={sectionStyle}>

            <div style={sectionTitleStyle}>
              Personal Information
            </div>

            {/* Full Name */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Full Name
              </label>

              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "4px" }}>
              <label style={labelStyle}>
                Password
              </label>

              <div style={passwordWrapperStyle}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={passwordInputStyle}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                  style={showPasswordButtonStyle}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small style={hintStyle}>
                Use at least 6 characters.
              </small>
            </div>

          </div>

          {/* ================= ACADEMIC INFORMATION ================= */}

          <div style={sectionStyle}>

            <div style={sectionTitleStyle}>
              Academic Information
            </div>

            <div style={academicGridStyle}>

              {/* Branch */}
              <div>
                <label style={labelStyle}>
                  Branch
                </label>

                <input
                  name="branch"
                  type="text"
                  placeholder="Example: CSE"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={inputStyle}
                />
              </div>

              {/* Semester */}
              <div>
                <label style={labelStyle}>
                  Semester
                </label>

                <input
                  name="semester"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Example: 5"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={inputStyle}
                />
              </div>

            </div>

          </div>

          {/* ================= SKILL INFORMATION ================= */}

          <div style={sectionStyle}>

            <div style={sectionTitleStyle}>
              Skill Exchange Profile
            </div>

            {/* Skills Offered */}
            <div style={skillBoxStyle}>

              <label style={skillLabelStyle}>
                <span style={skillIconStyle}>
                  💡
                </span>

                Skills You Offer
              </label>

              <input
                name="skillsOffered"
                type="text"
                placeholder="Example: Java, Python, React"
                value={formData.skillsOffered}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              />

              <small style={hintStyle}>
                Add skills you can teach. Separate them
                with commas.
              </small>

            </div>

            {/* Space between skills */}
            <div style={{ height: "20px" }} />

            {/* Skills Wanted */}
            <div style={skillBoxStyle}>

              <label style={skillLabelStyle}>
                <span style={skillIconStyle}>
                  🎯
                </span>

                Skills You Want to Learn
              </label>

              <input
                name="skillsWanted"
                type="text"
                placeholder="Example: Node.js, MongoDB, AI"
                value={formData.skillsWanted}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              />

              <small style={hintStyle}>
                Add skills you want to learn. Separate
                them with commas.
              </small>

            </div>

          </div>

          {/* ================= CREATE ACCOUNT ================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,

              background: loading
                ? "linear-gradient(135deg, #93c5fd, #a5b4fc)"
                : "linear-gradient(135deg, #2563eb, #4f46e5)",

              cursor: loading
                ? "not-allowed"
                : "pointer",

              opacity: loading ? 0.85 : 1,
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account 🚀"}
          </button>

        </form>

        {/* ================= LOGIN ================= */}

        <div style={loginSectionStyle}>

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
            disabled={loading}
            style={loginButtonStyle}
          >
            Login
          </button>

        </div>

      </div>
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const pageStyle = {
  minHeight: "100vh",

  background:
    "linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #eef2ff 100%)",

  display: "flex",

  justifyContent: "center",

  alignItems: "flex-start",

  padding: "35px 20px",

  boxSizing: "border-box",
};

const cardStyle = {
  width: "560px",

  maxWidth: "100%",

  background: "#ffffff",

  padding: "34px",

  borderRadius: "20px",

  boxShadow:
    "0 15px 45px rgba(15, 23, 42, 0.12)",

  boxSizing: "border-box",
};

const headerStyle = {
  textAlign: "center",

  marginBottom: "26px",
};

const logoStyle = {
  fontSize: "44px",

  marginBottom: "4px",
};

const titleStyle = {
  color: "#1d4ed8",

  margin: "0 0 7px",

  fontSize: "30px",

  fontWeight: "800",
};

const subtitleStyle = {
  color: "#64748b",

  margin: 0,

  fontSize: "14px",
};

const sectionStyle = {
  background: "#f8fafc",

  border: "1px solid #e2e8f0",

  borderRadius: "14px",

  padding: "18px",

  marginBottom: "18px",
};

const sectionTitleStyle = {
  color: "#1e3a8a",

  fontSize: "15px",

  fontWeight: "800",

  marginBottom: "15px",
};

const fieldStyle = {
  marginBottom: "16px",
};

const labelStyle = {
  display: "block",

  fontWeight: "700",

  color: "#334155",

  marginBottom: "7px",

  fontSize: "14px",
};

const inputStyle = {
  width: "100%",

  boxSizing: "border-box",

  padding: "13px 14px",

  border: "1px solid #cbd5e1",

  borderRadius: "9px",

  fontSize: "15px",

  outline: "none",

  background: "#ffffff",

  color: "#0f172a",
};

const academicGridStyle = {
  display: "grid",

  gridTemplateColumns: "1fr 1fr",

  gap: "14px",
};

const passwordWrapperStyle = {
  position: "relative",

  display: "flex",

  alignItems: "center",
};

const passwordInputStyle = {
  ...inputStyle,

  paddingRight: "68px",
};

const showPasswordButtonStyle = {
  position: "absolute",

  right: "8px",

  border: "none",

  background: "#eff6ff",

  color: "#2563eb",

  borderRadius: "6px",

  padding: "6px 8px",

  fontSize: "12px",

  fontWeight: "700",

  cursor: "pointer",
};

const skillBoxStyle = {
  background: "#ffffff",

  border: "1px solid #dbeafe",

  borderRadius: "11px",

  padding: "14px",
};

const skillLabelStyle = {
  display: "flex",

  alignItems: "center",

  gap: "7px",

  fontWeight: "700",

  color: "#334155",

  marginBottom: "8px",

  fontSize: "14px",
};

const skillIconStyle = {
  fontSize: "16px",
};

const hintStyle = {
  display: "block",

  color: "#64748b",

  fontSize: "12px",

  lineHeight: "1.5",

  marginTop: "7px",
};

const buttonStyle = {
  width: "100%",

  color: "white",

  border: "none",

  padding: "14px",

  borderRadius: "10px",

  fontSize: "16px",

  fontWeight: "800",

  marginTop: "4px",

  boxShadow:
    "0 7px 18px rgba(37, 99, 235, 0.22)",
};

const errorStyle = {
  display: "flex",

  gap: "9px",

  alignItems: "flex-start",

  background: "#fef2f2",

  color: "#b91c1c",

  padding: "12px 14px",

  border: "1px solid #fecaca",

  borderRadius: "9px",

  marginBottom: "18px",

  fontSize: "14px",

  lineHeight: "1.4",
};

const successStyle = {
  display: "flex",

  gap: "9px",

  alignItems: "flex-start",

  background: "#f0fdf4",

  color: "#15803d",

  padding: "12px 14px",

  border: "1px solid #bbf7d0",

  borderRadius: "9px",

  marginBottom: "18px",

  fontSize: "14px",

  lineHeight: "1.4",
};

const loginSectionStyle = {
  textAlign: "center",

  marginTop: "22px",

  color: "#64748b",

  fontSize: "14px",
};

const loginButtonStyle = {
  border: "none",

  background: "none",

  color: "#2563eb",

  cursor: "pointer",

  fontWeight: "800",

  marginLeft: "6px",

  fontSize: "14px",
};

export default Register;