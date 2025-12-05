import express from "express";
import { getCommunityFeed } from "../controllers/communityController.js";

const router = express.Router();

router.get("/feed", getCommunityFeed);

export default router;
