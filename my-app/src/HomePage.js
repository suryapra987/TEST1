import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = ({ userName }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token"); // Clear token from local storage
    localStorage.removeItem("userId"); // Clear userId if stored
    navigate("/"); // Redirect to the login page
  };

  return (
    <div>
      {/* Dashboard Header */}
      <div style={headerStyle}>
        <button
          onClick={toggleDropdown}
          style={dropdownButtonStyle}
          aria-expanded={isDropdownOpen}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        {isDropdownOpen && (
          <div style={dropdownMenuStyle}>
            <ul style={dropdownListStyle}>
              <li>
                <Link to="/profile" style={dropdownItemStyle}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/add-post" style={dropdownItemStyle}>
                  Add Post
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} style={dropdownItemStyle}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Dashboard Content */}
      <div style={dashboardContentStyle}>
        <h1>Welcome to the Dashboard!</h1>
        <p>
          Hello, <strong>{userName || "User"}</strong>! Manage your profile,
          posts, and more.
        </p>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const headerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px 15px",
  backgroundColor: "#282c34",
  color: "white",
  borderBottom: "2px solid #ddd",
  position: "relative",
};

const dropdownButtonStyle = {
  fontSize: "24px",
  padding: "10px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

const dropdownMenuStyle = {
  position: "absolute",
  top: "50px",
  left: "10px",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  zIndex: "1",
};

const dropdownListStyle = {
  listStyleType: "none",
  padding: "0",
  margin: "0",
};

const dropdownItemStyle = {
  padding: "10px 15px",
  textDecoration: "none",
  display: "block",
  color: "#333",
  cursor: "pointer",
  borderBottom: "1px solid #ddd",
};

const dashboardContentStyle = {
  padding: "20px",
  textAlign: "center",
};

export default HomePage;
