// routes/clubPostRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadPostImage } from "../middleware/uploadMiddleware.js";

import { createClubPost } from "../controllers/clubpostController.js";
import {
  getClubPosts,
  likePost,
  addComment,
  addReply,
  deleteClubPost,
} from "../controllers/clubpostController.js";

import { getUserClubsFeed } from "../controllers/clubpostController.js";

const router = express.Router();

// =====================
// Club Posts Routes
// =====================

// Create a new club post with optional image
router.post(
  "/club/:clubId",
  protect,
  uploadPostImage.single("image"),
  createClubPost
);

// Get all posts of a specific club
router.get("/club/:clubId", protect, getClubPosts);

// Delete a club post
router.delete("/:postId", protect, deleteClubPost);

// Like or unlike a post
router.post("/like/:postId", protect, likePost);

// Add a comment to a post
router.post("/comment/:postId", protect, addComment);

// Add a reply to a comment
router.post("/reply/:postId/:commentId", protect, addReply);

// =====================
// Homepage Feed Route
// =====================

// Fetch short feed from all clubs user belongs to
router.get("/feed", protect, getUserClubsFeed);

export default router;
