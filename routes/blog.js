const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogControllers");
const { requireAuthUser } = require('../middlewares/authMiddleware');

router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", requireAuthUser, blogController.createBlog);
router.delete("/:id", requireAuthUser, blogController.deleteBlog);
router.put("/:id", requireAuthUser, blogController.updateBlog);
router.post("/:id/comments", requireAuthUser, blogController.addComment);

module.exports = router;
