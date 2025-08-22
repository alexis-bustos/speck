const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userName = req.params.userName;
      const userProfile = await User.findOne({
        userName: new RegExp(`^${userName}$`, "i"), // to find case-insensitive usernames
      }).lean();
      if (!userProfile) return res.status(404).send("User not found");

      const [posts, postsCount, commentsCount] = await Promise.all([
        Post.find({ userId: userProfile._id }).sort({ createdAt: -1 }).lean(),
        Post.countDocuments({ userId: userProfile._id }),
        Comment.countDocuments({ userId: userProfile._id }),
      ]);

      res.render("profile", {
        userProfile,
        posts,
        user: req.user,
        counts: { posts: postsCount, comments: commentsCount },
        viewer: req.user || null, // to show "Edit Profile" if viewing own page
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  },
};
