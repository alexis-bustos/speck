const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostsSchema);
