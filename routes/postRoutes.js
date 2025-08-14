const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postController = require("../controllers/postController");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, postController.getAllPosts);
// router.get("/", postController.getAllPosts);

// GET/CREATE/SHOW FORM
router.get("/newPost", postController.showNewPostForm);
router.get("/:id", postController.getPostById);
router.post("/createPost", upload.single("file"), postController.createPost);

// UPDATE/EDIT
router.get("/edit/:id", postController.showEditForm);
router.put("/:id", postController.updatePost);

// DELETE
router.delete("/:id", postController.deletePost);

module.exports = router;
