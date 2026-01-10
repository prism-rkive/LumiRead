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

    // Filter out nulls in case any books were deleted from the DB
    const filteredShelf = user.bookshelf.filter(book => book !== null);

    res.json({ status: true, data: filteredShelf });
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

    // Filter out potential nulls if a book was deleted from DB but remains in user array
    const existingBookIds = user.bookshelf
      .filter((b) => b)
      .map((b) => b._id);

    const books = await Book.find({
      title: { $regex: title, $options: "i" },
      _id: { $nin: existingBookIds },
    });

    res.json({ status: true, data: books });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// ==============================
// ADD TO BOOKSHELF
// ==============================
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

    // Populate the bookshelf to see details
    await user.populate("bookshelf");

    // 1. Filter out nulls and get IDs only
    // This cleaning is crucial so .some() doesn't crash and .save() doesn't fail on nulls.
    // We map back to _id explicitly to ensure we are saving IDs, not full objects.
    const validBookIds = user.bookshelf
      .filter((b) => b !== null)
      .map((b) => b._id.toString());

    const book = await Book.findOne({ ibn });
    if (!book) return res.json({ status: false, message: "Book not found" });

    // 2. Check for duplicate using the clean ID list
    if (validBookIds.includes(book._id.toString())) {
      return res.json({ status: true, message: "Book added to shelf!", type: "exists" });
    }

    // 3. Update the user's bookshelf to the clean list of IDs
    user.bookshelf = validBookIds;

    // 4. Add new book ID
    user.bookshelf.push(book._id);

    // 5. Save
    await user.save();

    res.json({ status: true, message: "Book added to bookshelf" });
  } catch (err) {
    console.error("Add to shelf error:", err);
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
