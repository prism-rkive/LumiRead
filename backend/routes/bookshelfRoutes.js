import express from "express";
import {
  getBookshelf,
  searchBooks,
  addToBookshelf,
  removeFromBookshelf,
} from "../controllers/bookshelfController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1️⃣ Fetch all books in user's bookshelf
router.get("/mybooks", protect, getBookshelf);

// 2️⃣ Search books by title
router.get("/search", protect, searchBooks);

// 3️⃣ Add a book to bookshelf
router.post("/addtoShelf", protect, addToBookshelf);

// 4️⃣ Remove a book from bookshelf (NEW)
router.delete("/:bookId", protect, removeFromBookshelf);

export default router;
