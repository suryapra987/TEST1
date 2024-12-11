const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  userId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Post", PostSchema);
