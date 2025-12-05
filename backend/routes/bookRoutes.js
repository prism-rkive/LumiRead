import express from "express";
import { getCurrentBooks, addBook } from "../controllers/bookController.js";

const router = express.Router();

router.get("/current", getCurrentBooks);
router.post("/", addBook);

export default router;
