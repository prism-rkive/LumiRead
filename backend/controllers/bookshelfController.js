import Book from "../models/Book.js";
import User from "../models/User.js";

// ==============================
// GET MY BOOKSHELF (with optional limit)
// ==============================
export const getBookshelf = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    const limit = parseInt(req.query.limit);

    await user.populate({
      path: "bookshelf",
      options: limit ? { limit } : {},
    });

    res.json({ status: true, data: user.bookshelf });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ==============================
// SEARCH BOOKS
// ==============================
export const searchBooks = async (req, res) => {
  const { title } = req.query;
  if (!title) return res.json({ status: false, data: [] });

  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    await user.populate("bookshelf");

    const books = await Book.find({
      title: { $regex: title, $options: "i" },
      _id: { $nin: user.bookshelf.map((b) => b._id) },
    });

    res.json({ status: true, data: books });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ==============================
// ADD TO BOOKSHELF
// ==============================
export const addToBookshelf = async (req, res) => {
  const { ibn } = req.body;
  if (!ibn) return res.json({ status: false, message: "Missing bookId" });

  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    await user.populate("bookshelf");

    const book = await Book.findOne({ ibn });
    if (!book) return res.json({ status: false, message: "Book not found" });

    const exists = user.bookshelf.some((b) => b.ibn === book.ibn);
    if (exists)
      return res.json({ status: false, message: "Already in bookshelf" });

    user.bookshelf.push(book._id);
    await user.save();

    res.json({ status: true, message: "Book added to bookshelf" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ==============================
// REMOVE FROM BOOKSHELF (NEW)
// ==============================
export const removeFromBookshelf = async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ status: false, message: "Missing bookId" });
  }

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    // Check if the book exists in user's bookshelf
    const bookIndex = user.bookshelf.findIndex(
      (id) => id.toString() === bookId
    );

    if (bookIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "Book not found in bookshelf",
      });
    }

    // Remove the book from bookshelf array
    user.bookshelf.splice(bookIndex, 1);
    await user.save();

    res.json({
      status: true,
      message: "Book removed from bookshelf successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
