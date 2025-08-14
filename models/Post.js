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

// add the image and cloudinaryId fields to the schema.
// Must use this because the schema has already been created.
PostsSchema.add({
  image: String,
  cloudinaryId: String,
});

module.exports = mongoose.model("Post", PostsSchema);
