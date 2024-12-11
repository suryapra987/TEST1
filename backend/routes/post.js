const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Get posts by user
router.get("/:userId", auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const post = new Post({
      name,
      description,
      userId,
      image: req.file?.path,
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };
    if (req.file) updateData.image = req.file.path;

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post
router.delete("/:id", auth, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
