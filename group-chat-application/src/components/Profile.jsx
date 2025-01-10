import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = (user) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Profile Initials */}

      <div
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: "#555",
          color: "white",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "10px",
          fontWeight: "bold",
          fontSize: "1.2em",
          cursor: "pointer",
        }}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {user.user.charAt(0).toUpperCase()}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "0",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                color: "#333",
                textAlign: "left",
              }}
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
