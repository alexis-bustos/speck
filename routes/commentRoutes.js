const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { ensureAuth } = require("../middleware/auth");

router.post("/createComment", commentController.createComment);

// GET -- view individual comment and the comments related to it
// router.get('/', commentController.getCommentById)

// UPDATE/EDIT
// router.get("/edit/:id", commentController.showEditForm);
// router.put("/:id", commentController.updateComment);

// // DELETE
router.delete("/:id", ensureAuth, commentController.deleteComment);

module.exports = router;
