import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const IndexPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Navigate to the Login page
  };

  const handleRegister = () => {
    navigate("/register"); // Navigate to the Register page
  };

  return (
    <div id="root">
      <h1>Welcome to My App</h1>
      <div className="button-container">
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
        <button onClick={handleRegister} className="register-button">
          Register
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
