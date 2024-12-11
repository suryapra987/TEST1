const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserDetails = require("../models/UserDetails");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = require("../config/multer");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Create an entry in UserDetails for the new user
    const userDetails = new UserDetails({ userId: savedUser._id });
    await userDetails.save();

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error Registering User" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Fetch Profile
router.get("/profile/:userID", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDetails = await UserDetails.findOne({ userId: user._id });
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found" });
    }

    res.json({ ...user.toObject(), details: userDetails });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update Profile
router.put("/profile/:userID", async (req, res) => {
  const { image, address, phone, skills } = req.body;
  try {
    const userDetails = await UserDetails.findOneAndUpdate(
      { userId: req.params.id },
      { image, address, phone, skills },
      { new: true, upsert: true } // Create a document if it doesn't exist
    );

    // if (!userDetails) {
    //   return res.status(404).json({ message: "User details not found" });
    // }

    res.json({ message: "Profile updated successfully", userDetails });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

//update image

router.put(
  "/profile/:userID",
  auth,
  upload.single("image"),
  async (req, res) => {
    const { address, phone, skills } = req.body;
    try {
      const updateData = { address, phone, skills: JSON.parse(skills) };
      if (req.file) {
        updateData.image = req.file.path; // Save uploaded image path
      }

      const userDetails = await UserDetails.findOneAndUpdate(
        { userId: req.params.id },
        updateData,
        { new: true, upsert: true }
      );

      res.json({ message: "Profile updated successfully", userDetails });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

module.exports = router;
