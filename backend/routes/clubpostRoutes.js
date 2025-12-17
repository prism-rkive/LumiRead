import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadPostImage } from "../middleware/uploadMiddleware.js";
import { createClubPost } from "../controllers/clubpostController.js";
import {
  getClubPosts,
  likePost,
  addComment,
  addReply,
  deleteClubPost
} from "../controllers/clubpostController.js"

const router = express.Router();

router.post("/club/:clubId",protect, uploadPostImage.single("image"), createClubPost
);
router.get("/club/:clubId", protect, getClubPosts);
router.delete( "/:postId",protect,deleteClubPost);

router.post("/like/:postId", protect, likePost);
router.post("/comment/:postId", protect, addComment);
router.post("/reply/:postId/:commentId", protect, addReply);

export default router;
