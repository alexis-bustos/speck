const Post = require("../models/Post");
const Comment = require("../models/Comment");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      let post = await Post.find().sort({ createdAt: -1 });
      // const post = await Post.find({ userId: req.user.id }).sort({
      //   createdAt: -1,
      // });

      // Iterate through each post in the array
      for (let i = 0; i < post.length; i++) {
        const currentPost = post[i]; // Get the current post document

        // Check if the fields exist and set defaults if they don't
        if (currentPost.image === undefined || currentPost.image === null) {
          currentPost.image = null; // Or null, or a default URL
        }
        if (
          currentPost.cloudinaryId === undefined ||
          currentPost.cloudinaryId === null
        ) {
          currentPost.cloudinaryId = null;
        }
        // Save the updated single document
        // This will write the changes back to the database for the current post
        await currentPost.save();
      }

      res.render("posts", {
        post,
        user: req.user, // pass the User to the view as well to hide edit button on other Users' posts
      });
    } catch (err) {
      console.log(err);
    }
  },
  getPostById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).send("Post not found");
      }

      // Get all comments for this specific post
      const comments = Comment.find({ postId: req.params.id }).sort({
        createdAt: -1,
      });

      res.render("post", {
        post,
        comments,
        user: req.user, // pass the User to the view as well to hide edit button on other Users' posts
      });
    } catch (error) {
      res.status(500).send("Server Error");
    }
  },
  showNewPostForm: async (req, res) => {
    try {
      res.render("newPost");
    } catch (error) {
      console.log(error);
    }
  },
  createPost: async (req, res) => {
    try {
      let result = "";
      if (req.file) {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      const { title, content } = req.body;
      const userId = req.user.id;

      await Post.create({
        title,
        content,
        author: req.user.userName,
        userId,
        image: result.secure_url || null,
        cloudinaryId: result.public_id || null,
      });
      console.log("Post has been added!");
      res.redirect("/posts");
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (String(post.userId) !== req.user.id) {
        return res.status(403).send("Unauthorized");
      }
      await Post.findByIdAndDelete(req.params.id);
      console.log("Deleted Post");
      res.redirect("/posts");
    } catch (err) {
      res.status(500).send("Error deleting post");
    }
  },
  showEditForm: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("edit", { post });
    } catch (error) {
      res.status(404).send("Post not found");
    }
  },
  updatePost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (String(post.userId) !== req.user.id) {
        return res.status(403).send("Unauthorized");
      }
      await Post.findByIdAndUpdate(req.params.id, {
        title,
        content,
        author: req.user.userName,
      });

      res.redirect(`/posts/${req.params.id}`);
    } catch (error) {
      res.status(500).send("Error updating post");
    }
  },
};
