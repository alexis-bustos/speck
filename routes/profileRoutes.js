const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const upload = require("../middleware/multer");
const profileController = require("../controllers/profileController");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:userName", profileController.getProfile);

router.post(
  "/avatar",
  ensureAuth,
  upload.single("avatar"),
  profileController.uploadAvatar
);

module.exports = router;
