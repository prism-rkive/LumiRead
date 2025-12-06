// src/services/api.js

// Keep this exported if other components need it, but use it consistently.
// We'll rename it to avoid redundancy and use the existing env variable name.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// EXPORT this if you need it elsewhere, otherwise, just use the private constant.
export const API_ROOT = BASE_URL;

async function fetchJson(path, options = {}) {
  // Use BASE_URL consistently
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

export const getUser = () => fetchJson("/api/user/me");
export const getCurrentBooks = () => fetchJson("/api/books/current");
export const getCommunityFeed = () => fetchJson("/api/community/feed");

export const addBook = (payload) =>
  fetchJson("/api/books", { method: "POST", body: JSON.stringify(payload) });
