import { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: storedUser?.name || "",
    email: storedUser?.email || "",
    branch: storedUser?.branch || "",
    semester: storedUser?.semester || "",
    skillsOffered: storedUser?.skillsOffered?.join(", ") || "",
    skillsWanted: storedUser?.skillsWanted?.join(", ") || "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await API.put(`/users/profile/${storedUser._id}`, {
        ...user,
        semester: Number(user.semester),
        skillsOffered: user.skillsOffered
          .split(",")
          .map((skill) => skill.trim()),
        skillsWanted: user.skillsWanted
          .split(",")
          .map((skill) => skill.trim()),
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("✅ Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      alert("Profile Update Failed");
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
            maxWidth: "650px",
            margin: "auto",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              color: "#2563eb",
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            👤 My Profile
          </h1>

          <form onSubmit={updateProfile}>

            <label><b>Name</b></label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              style={inputStyle}
            />

            <label><b>Email</b></label>
            <input
              type="email"
              value={user.email}
              disabled
              style={inputStyle}
            />

            <label><b>Branch</b></label>
            <input
              type="text"
              name="branch"
              value={user.branch}
              onChange={handleChange}
              style={inputStyle}
            />

            <label><b>Semester</b></label>
            <input
              type="number"
              name="semester"
              value={user.semester}
              onChange={handleChange}
              style={inputStyle}
            />

            <label><b>Skills Offered</b></label>
            <input
              type="text"
              name="skillsOffered"
              value={user.skillsOffered}
              onChange={handleChange}
              placeholder="Java, Python, React"
              style={inputStyle}
            />

            <label><b>Skills Wanted</b></label>
            <input
              type="text"
              name="skillsWanted"
              value={user.skillsWanted}
              onChange={handleChange}
              placeholder="Node, MongoDB"
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                marginTop: "20px",
              }}
            >
              💾 Save Changes
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px",
  boxSizing: "border-box",
};

export default Profile;