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
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      const postId = comment.postId;

      const userId = req.user?._id || req.user?.id;
      if (String(comment.userId) !== String(userId)) {
        return res.status(403).send("Unauthorized");
      }

      await Comment.findByIdAndDelete(comment._id);
      console.log("Deleted Comment");
      res.redirect(`/posts/${postId}`);
    } catch (err) {
      res.status(500).send("Error deleting post");
    }
  },
  // updateComment: async (req, res) => {
  //   try {
  //     const { title, content } = req.body;
  //     const comment = await Comment.findById(req.params.id);
  //     if (!comment) {
  //       return res.status(404).send("Comment not found");
  //     }
  //     if (String(comment.userId) !== req.user.id) {
  //       return res.status(403).send("Unauthorized");
  //     }
  //     await Comment.findByIdAndUpdate(req.params.id, {
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
