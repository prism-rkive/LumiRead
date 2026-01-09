import express from "express";
import {
  getUserProfile,
  registerUser,
  authUser,
  isAuthed,
  updateUserProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/isAuthed", isAuthed);
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
