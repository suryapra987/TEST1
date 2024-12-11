const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: { type: String },
  phone: { type: String },
  skills: [{ type: String }],
  image: { type: String }, // Path to the uploaded image
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
