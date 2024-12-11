import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./IndexPage";
import Login from "./Login";
import Register from "./Register";
import HomePage from "./HomePage"; // Import the HomePage component
import Profile from "./Profile"; // Import Profile component
import AddPost from "./AddPost"; // Import AddPost component

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<IndexPage />} /> {/* Index Page */}
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/register" element={<Register />} />{" "}
          {/* Register Page */}
          <Route path="/home" element={<HomePage />} />{" "}
          {/* Home Page after login */}
          <Route path="/profile" element={<Profile />} /> {/* Profile page */}
          <Route path="/add-post" element={<AddPost />} /> {/* Add Post page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
