import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "white", margin: 0 }}>
        Student Skill Exchange
      </h2>

      <div>
        <Link
          to="/dashboard"
          style={linkStyle}
        >
          Dashboard
        </Link>

        <Link
          to="/search"
          style={linkStyle}
        >
          Search
        </Link>

        <Link
          to="/requests"
          style={linkStyle}
        >
          Requests
        </Link>

        <Link
          to="/profile"
          style={linkStyle}
        >
          Profile
        </Link>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "15px",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginRight: "20px",
  fontWeight: "bold",
};

export default Navbar;