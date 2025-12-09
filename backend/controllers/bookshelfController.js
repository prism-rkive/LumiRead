// controllers/bookshelfController.js
import Book from "../models/Book.js";
import User from "../models/User.js";

export const getBookshelf = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ status: false, message: "Unauthorized" });

    await user.populate("bookshelf"); // populate the bookshelf array

    res.json({ status: true, data: user.bookshelf });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const searchBooks = async (req, res) => {
  const { title } = req.query; // search string
  if (!title) return res.json({ status: false, data: [] });

  try {
    const user = req.user;
    if (!user) return res.status(401).json({ status: false, message: "Unauthorized" });

    // Fetch user's bookshelf to exclude already added books
    await user.populate("bookshelf");

    // Search books by name (case-insensitive, partial match)
    const books = await Book.find({
      title: { $regex: title, $options: "i" }, // "i" = case-insensitive
      _id: { $nin: user.bookshelf.map((b) => b._id) }, // exclude books in shelf
    });

    res.json({ status: true, data: books });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
export const addToBookshelf = async (req, res) => {
  const { ibn } = req.body;

  if (!ibn) return res.json({ status: false, message: "Missing bookId" });

  try {
    const user = req.user;
    if (!user) return res.status(401).json({ status: false, message: "Unauthorized" });

    // Fetch user's bookshelf to check duplicates
    await user.populate("bookshelf");

    const book = await Book.findOne({ibn});
    if (!book) return res.json({ status: false, message: "Book not found" });

    const exists = user.bookshelf.some((b) => b.ibn === book.ibn);
    if (exists) return res.json({ status: false, message: "Already in bookshelf" });

    user.bookshelf.push(book._id);
    await user.save();

    res.json({ status: true, message: "Book added to bookshelf" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


