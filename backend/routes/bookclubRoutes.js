import express from "express";
import { createBookClub } from "../controllers/bookclubController.js";
import { getBookClubById } from "../controllers/bookclubController.js";
import {addMemberToClub } from "../controllers/bookclubController.js";
import { getMyBookClubs } from "../controllers/bookclubController.js";
import { getAllBookClubs } from "../controllers/bookclubController.js";
import { joinPublicClub } from "../controllers/bookclubController.js";
import { requestToJoinClub ,acceptJoinRequest,denyJoinRequest} from "../controllers/bookclubController.js";


import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new book club
router.post("/", protect, createBookClub);
router.get("/my-clubs", protect, getMyBookClubs);
router.get("/all", protect, getAllBookClubs);
router.get("/:id", protect, getBookClubById);
router.post("/:id/add-member", addMemberToClub);
router.post("/:id/join", protect, joinPublicClub);
router.post("/:id/request", protect, requestToJoinClub);
router.post("/:id/accept/:userId", protect, acceptJoinRequest);
router.post("/:id/deny/:userId", protect, denyJoinRequest);




export default router;
