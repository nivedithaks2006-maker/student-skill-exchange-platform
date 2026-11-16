import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2563eb, #1e40af)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 60px",
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <h2>🎓 Skill Exchange</h2>

        <div>
          <Link to="/login">
            <button style={btn}>Login</button>
          </Link>

          <Link to="/register">
            <button style={{ ...btn, marginLeft: 15 }}>
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "48px" }}>
          Student Skill Exchange Platform
        </h1>

        <p
          style={{
            fontSize: "22px",
            marginTop: "20px",
            color: "#e5e7eb",
          }}
        >
          Learn New Skills • Share Your Knowledge • Connect With Students
        </p>

        <Link to="/register">
          <button
            style={{
              marginTop: "40px",
              padding: "15px 35px",
              fontSize: "20px",
              border: "none",
              borderRadius: "8px",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Get Started
          </button>
        </Link>
      </div>

      {/* Features */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          marginTop: "80px",
          flexWrap: "wrap",
          paddingBottom: "80px",
        }}
      >
        {[
          {
            title: "🔍 Search Students",
            desc: "Find students by skills or branch.",
          },
          {
            title: "🤝 Skill Exchange",
            desc: "Send and receive exchange requests.",
          },
          {
            title: "👤 Student Profile",
            desc: "Manage your profile and skills.",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              width: "280px",
              background: "white",
              color: "#111827",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#1e3a8a",
        }}
      >
        © 2026 Student Skill Exchange Platform
      </footer>
    </div>
  );
}

const btn = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "white",
  color: "#2563eb",
  fontWeight: "bold",
};

export default Home;