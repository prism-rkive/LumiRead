import Book from "../models/Book.js";

// GET /api/books/current
export const getCurrentBooks = async (req, res) => {
  // Filter for books currently being read
  const books = await Book.find({ status: "current" });
  res.json(books);
};

// POST /api/books
export const addBook = async (req, res) => {
  const { ibn, title, author, language, cover_img, description, buy_url, year, genre } = req.body;
  const user = req.user; // From protect middleware

  if (!user) {
    return res.status(401).json({ status: false, message: "Not authorized" });
  }

  try {
    let book = await Book.findOne({ ibn });

    if (book) {
      // Check if already in user's shelf
      const alreadyInShelf = user.bookshelf.some(id => id.toString() === book._id.toString());

      if (alreadyInShelf) {
        return res.json({ status: true, type: "exists", message: "Book already exists" });
      } else {
        user.bookshelf.push(book._id);
        await user.save();
        return res.json({ status: true, message: "Book added to shelf!" });
      }
    }

    // Create new book
    book = await Book.create({
      userId: user._id,
      ibn,
      title,
      author,
      language,
      cover_img,
      description,
      buy_url,
      year,
      genre: Array.isArray(genre) ? genre : (genre ? genre.split(',') : []),
    });

    // Add to shelf
    user.bookshelf.push(book._id);
    await user.save();

    res.json({ status: true, message: "Book added to shelf!" });
  } catch (error) {
    res.status(500).json({ status: false, type: "save", error: error.message });
  }
};

// POST /search (Legacy wrapper)
export const searchBooks = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.json({ status: false, message: "Query required" });
  }

  try {
    // Search by title or author, case-insensitive
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });

    res.json({
      status: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// POST /checkbook (Legacy wrapper)
export const checkBook = async (req, res) => {
  const { ibn } = req.body;

  if (!ibn) {
    return res.json({ status: false, message: "ISBN required" });
  }

  try {
    const book = await Book.findOne({ ibn });

    if (book) {
      res.json({
        status: true,
        exists: true,
        book: book,
      });
    } else {
      res.json({
        status: true,
        exists: false,
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// POST /getbook (Legacy wrapper)
export const getBook = async (req, res) => {
  const { ibn } = req.body;

  if (!ibn) {
    return res.json({ status: false, message: "ISBN required" });
  }

  try {
    const book = await Book.findOne({ ibn }).populate("reviews.user_id", "name username");

    if (book) {
      res.json({
        status: true,
        data: book,
      });
    } else {
      res.json({
        status: false,
        message: "Book not found",
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};
// POST /addreview
export const addReview = async (req, res) => {
  const { ibn, rating, comment } = req.body;
  const user = req.user; // from protect middleware

  if (!user) {
    // Should be caught by middleware, but safety check
    return res.status(401).json({ status: false, message: "Not authorized within controller" });
  }

  try {
    const book = await Book.findOne({ ibn });

    if (!book) {
      return res.json({ status: false, message: "Book not found" });
    }

    const alreadyReviewed = book.reviews.find(
      (r) => r.user_id.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      alreadyReviewed.date = Date.now();
    } else {
      const review = {
        user_id: user._id,
        rating: Number(rating),
        comment,
      };

      book.reviews.push(review);
    }

    book.avg_rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) /
      book.reviews.length;

    await book.save();

    // Return updated book with populated details so frontend updates immediately
    const updatedBook = await Book.findOne({ ibn }).populate("reviews.user_id", "name username");

    res.status(201).json({ status: true, message: "Review added", data: updatedBook });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

// GET /api/books/all
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json({
      status: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};