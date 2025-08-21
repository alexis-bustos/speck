// const Post = require("../models/Post");
const Comment = require("../models/Comment");
// const cloudinary = require("../middleware/cloudinary");

module.exports = {
  createComment: async (req, res) => {
    try {
      const { content, postId } = req.body;
      const userId = req.user?.id;
      const clean = (content || "").trim();
      if (!clean) {
        req.flash("error", "Comment cannot be empty");
        return res.redirect(`/posts/${postId}`);
      }

      await Comment.create({
        content: content.trim(),
        author: req.user.userName || "Anonymous",
        userId,
        postId,
      });

      console.log("Comment has been added!");
      // res.location("back");
      res.redirect(`/posts/${postId}`);
    } catch (err) {
      console.log(err);
    }
  },
  // deletePost: async (req, res) => {
  //   try {
  //     const post = await Post.findById(req.params.id);
  //     if (String(post.userId) !== req.user.id) {
  //       return res.status(403).send("Unauthorized");
  //     }
  //     await Post.findByIdAndDelete(req.params.id);
  //     console.log("Deleted Post");
  //     res.redirect("/posts");
  //   } catch (err) {
  //     res.status(500).send("Error deleting post");
  //   }
  // },
  // updatePost: async (req, res) => {
  //   try {
  //     const { title, content } = req.body;
  //     const post = await Post.findById(req.params.id);
  //     if (!post) {
  //       return res.status(404).send("Post not found");
  //     }
  //     if (String(post.userId) !== req.user.id) {
  //       return res.status(403).send("Unauthorized");
  //     }
  //     await Post.findByIdAndUpdate(req.params.id, {
  //       title,
  //       content,
  //       author: req.user.userName,
  //     });

  //     res.redirect(`/posts/${req.params.id}`);
  //   } catch (error) {
  //     res.status(500).send("Error updating post");
  //   }
  // },
};
