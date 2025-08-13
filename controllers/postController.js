const Post = require("../models/Post");

module.exports = {
  getAllPosts: async (req, res) => {
    try {
      const post = await Post.find().sort({ createdAt: -1 });
      // const post = await Post.find({ userId: req.user.id }).sort({
      //   createdAt: -1,
      // });
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
      console.log(req.user);
      console.log(req.user.id);
      console.log(post.userId);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      // user && post.userId === user.id

      res.render("post", {
        post,
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
      const { title, content, author } = req.body;
      const userId = req.user.id;
      await Post.create({
        title,
        content,
        author,
        userId,
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
      if (post.userId !== req.user.id) {
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
      const { title, content, author } = req.body;
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }
      if (post.userId !== req.user.id) {
        return res.status(403).send("Unauthorized");
      }
      await Post.findByIdAndUpdate(req.params.id, {
        title,
        content,
        author,
      });

      res.redirect(`/posts/${req.params.id}`);
    } catch (error) {
      res.status(500).send("Error updating post");
    }
  },
};
