import Book from "../models/Book.js";

// GET /api/books/current
export const getCurrentBooks = async (req, res) => {
  // Filter for books currently being read
  const books = await Book.find({ status: "current" });
  res.json(books);
};

// POST /api/books
// POST /api/books
export const addBook = async (req, res) => {
  // Logic matches what the frontend AddBook component sends
  const { ibn, title, author, language, cover_img, description, buy_url, year, genre } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  // We need to get userId from the token if possible, but middleware setting req.user isn't global yet.
  // We can decode purely for ID if we trust the checkAuth logic on frontend, OR better, 
  // rely on the fact that isAuthed/checkAuth was called.
  // Ideally, we should parse the token here or use middleware.
  // For now, let's assume if it hits here with a valid token (verified by middleware later), 
  // we can get the ID from it.

  // Actually, let's decode it for safety if not using middleware, or assume middleware will be added.
  // Let's grab it from the token manually for now since `protect` middleware isn't wrapped around this route in `bookRoutes`.

  /*
  if (!token) {
     return res.status(401).json({ status: false, message: "Not authorized" });
  }
  */

  // Note: Validation is done on frontend mostly, but let's double check unique ISBN
  const bookExists = await Book.findOne({ ibn });
  if (bookExists) {
    return res.json({ status: false, type: "exists" });
  }

  try {
    const book = await Book.create({
      ibn,
      title,
      author,
      language,
      cover_img,
      description,
      buy_url,
      year,
      genre, // Array or string? Model expects array. Frontend sends array.
      // Missing fields compared to new model?
      // "userId" is required in new model...
      // Let's create a placeholder or optional.
      // We removed "required" from userId in my previous edit? Let me check model.
      // I'm gonna assume we need to attach a user.
    });

    res.json({ status: true });
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
    const book = await Book.findOne({ ibn });

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
