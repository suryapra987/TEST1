import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the login request to the API
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      // Alert success and store the token
      // alert("Login successful! Token: " + response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      // Navigate to the Home page after successful login
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
