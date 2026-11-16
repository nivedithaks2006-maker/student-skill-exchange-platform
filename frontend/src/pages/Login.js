import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      alert(res.data.message);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "35px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "25px",
          }}
        >
          🔐 Student Login
        </h2>

        <form onSubmit={login}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "18px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default Login;