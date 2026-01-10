// src/services/api.js

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Helper to fetch JSON with optional auth token
async function fetchJson(path, options = {}) {
  const token = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")).token
    : null;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.status === 204 ? null : res.json();
}

// ----------------- USER APIs -----------------
export const getUser = () => fetchJson("/api/user/me");

// ----------------- BOOKSHELF APIs -----------------
export const getCurrentBooks = (limit = 5) =>
  fetchJson(`/api/bookshelf/mybooks?limit=${limit}`);

export const addBookToShelf = (payload) =>
  fetchJson("/api/bookshelf/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ----------------- COMMUNITY APIs -----------------
export const getCommunityFeed = () => fetchJson("/api/clubpost/feed");

// ----------------- BOOK APIs -----------------
export const getAllLibraryBooks = () => fetchJson("/api/books/all");

export const addBook = (payload) =>
  fetchJson("/api/books", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const searchBooks = (query) =>
  fetchJson("/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

export const checkBook = (bookId) =>
  fetchJson("/checkbook", {
    method: "POST",
    body: JSON.stringify({ bookId }),
  });

export const getBook = (bookId) =>
  fetchJson("/getbook", {
    method: "POST",
    body: JSON.stringify({ bookId }),
  });

export const addReview = (bookId, review) =>
  fetchJson("/addreview", {
    method: "POST",
    body: JSON.stringify({ bookId, review }),
  });

// ----------------- EXPORT BASE URL -----------------
export const API_ROOT = BASE_URL;
