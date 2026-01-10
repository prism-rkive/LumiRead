import express from "express";
import { getCurrentBooks, addBook, getAllBooks } from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/current", getCurrentBooks);
router.get("/all", getAllBooks);
router.post("/", protect, addBook);

export default router;
