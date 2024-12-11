import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [details, setDetails] = useState({
    address: "",
    phone: "",
    skills: [],
    image: "",
  });

  const [skillsOptions] = useState(["HTML", "CSS", "JavaScript", "React"]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Ensure userId is stored on login

        // Fetch combined user data
        const response = await axios.get(
          `http://localhost:5000/api/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { name, email, image, address, phone, skills } = response.data;
        setUser({ name, email });
        setDetails({ address, phone, skills: skills || [], image });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleSkillsChange = (skill) => {
    setDetails((prevDetails) => {
      const newSkills = prevDetails.skills.includes(skill)
        ? prevDetails.skills.filter((s) => s !== skill)
        : [...prevDetails.skills, skill];
      return { ...prevDetails, skills: newSkills };
    });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("address", details.address);
      formData.append("phone", details.phone);
      formData.append("skills", JSON.stringify(details.skills));
      if (selectedImage) formData.append("image", selectedImage);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId"); // Ensure userId is included

      await axios.put(`http://localhost:5000/api/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      alert("Failed to update profile.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Profile Update</h1>
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input type="text" name="name" value={user.name} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input type="email" name="email" value={user.email} disabled />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={details.address}
            onChange={handleDetailsChange}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={details.phone}
            onChange={handleDetailsChange}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Skills:</label>
          {skillsOptions.map((skill) => (
            <div key={skill}>
              <label>
                <input
                  type="checkbox"
                  checked={details.skills.includes(skill)}
                  onChange={() => handleSkillsChange(skill)}
                />
                {skill}
              </label>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Profile Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfilePage;
