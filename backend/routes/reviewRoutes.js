import express from "express";
import Book from "../models/Book.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /reviews/:isbn - Fetch all reviews for a specific book
router.get("/:isbn", protect, async (req, res) => {
  try {
    const { isbn } = req.params;

    const book = await Book.findOne({ ibn: isbn }).populate(
      "reviews.user_id",
      "name avatar email"
    );

    if (!book) {
      return res.status(200).json({
        status: true,
        reviews: [],
        count: 0,
        message: "No reviews yet for this book",
      });
    }

    return res.status(200).json({
      status: true,
      reviews: book.reviews || [],
      count: book.reviews ? book.reviews.length : 0,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      status: false,
      message: "Server error fetching reviews",
      error: error.message,
    });
  }
});

// POST /reviews - Add or update a review
router.post("/", protect, async (req, res) => {
  try {
    const { ibn, rating, comment } = req.body;
    const userId = req.user._id;

    const book = await Book.findOne({ ibn });

    if (!book) {
      return res.status(404).json({
        status: false,
        message: "Book not found. Please add the book first.",
      });
    }

    const existingReviewIndex = book.reviews.findIndex(
      (review) => review.user_id.toString() === userId.toString()
    );

    if (existingReviewIndex !== -1) {
      book.reviews[existingReviewIndex].rating = rating;
      book.reviews[existingReviewIndex].comment = comment;
      book.reviews[existingReviewIndex].date = Date.now();
    } else {
      book.reviews.push({
        user_id: userId,
        rating,
        comment,
        date: Date.now(),
      });
    }

    const totalRating = book.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    book.avg_rating =
      book.reviews.length > 0 ? totalRating / book.reviews.length : 0;

    await book.save();

    return res.status(200).json({
      status: true,
      message:
        existingReviewIndex !== -1
          ? "Review updated successfully"
          : "Review added successfully",
      avg_rating: book.avg_rating,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      status: false,
      message: "Server error adding review",
      error: error.message,
    });
  }
});

export default router;
