import Book from "../models/Book.js";

// GET /api/books/current
export const getCurrentBooks = async (req, res) => {
  // Filter for books currently being read
  const books = await Book.find({ status: "current" });
  res.json(books);
};

// POST /api/books
export const addBook = async (req, res) => {
  // In a real app, you would validate the input and set userId from the session/token.
  // For this scaffold, we'll assume the request body is valid.

  const { title, author, pages, userId } = req.body;

  if (!title || !author || !pages || !userId) {
    res.status(400);
    throw new Error("Please include a title, author, pages, and userId");
  }

  const book = await Book.create({
    userId, // Needs to come from the request body until auth is added
    title,
    author,
    pages,
    progress: 0,
    status: "to-read", // Default to to-read when initially added
  });

  res.status(201).json(book);
};
