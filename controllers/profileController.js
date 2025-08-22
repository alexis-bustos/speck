const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");

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
  uploadAvatar: async (req, res) => {
    try {
      if (!req.file) return res.redirect("back");

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "speck/avatars",
        overwrite: true,
        transformation: [
          { width: 512, height: 512, crop: "fill", gravity: "face" }, // nice square crop
          { quality: "auto", fetch_format: "auto" },
        ],
      });

      // Clean temp file
      fs.unlink(req.file.path, () => {});

      // Update user
      const userId = req.user._id || req.user._id;
      const user = await User.findById(userId);

      // Delete previous avatar
      // if (user.avatarPublicId) {
      //   try {
      //     await cloudinary.uploader.destroy(user.avatarPublicId);
      //   } catch (_) {}
      // }

      user.avatarUrl = result.secure_url;
      user.avatarPublicId = result.public_id;
      await user.save();

      // Redirect back to their profile
      return res.redirect(`/profile/${user.userName}`);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Avatar upload failed");
    }
  },
};
