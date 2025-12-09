// routes/books.js
import express from "express";
import { getBookshelf, searchBooks, addToBookshelf } from "../controllers/bookshelfController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1️⃣ Fetch all books in user's bookshelf (NEW)
router.get("/mybooks", protect, getBookshelf);

// 2️⃣ Search books by title
router.get("/search", protect, searchBooks); // GET /api/bookshelf/search?title=xyz

// 3️⃣ Add a book to bookshelf
router.post("/addtoShelf", protect, addToBookshelf);

export default router;

