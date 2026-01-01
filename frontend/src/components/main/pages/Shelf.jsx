import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BookshelfPage.css"; // make sure this file exists

// If you used lucide earlier, you can keep or replace with inline SVG. I will use inline SVG for portability.
const BookIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#8C4A2F" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6ZM6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z" />
  </svg>
);

const BookshelfPage = () => {
  const [bookshelf, setBookshelf] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getToken = () => {
    const stored = JSON.parse(localStorage.getItem("currentUser"));
    return stored?.token || "";
  };

  const fetchBookshelf = async () => {
    try {
      const token = getToken();
      const { data } = await axios.get(
        "http://localhost:5000/api/bookshelf/mybooks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.status) setBookshelf(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookshelf();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const token = getToken();
      const { data } = await axios.get(
        `http://localhost:5000/api/bookshelf/search?title=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status) setSearchResults(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToShelf = async (ibn) => {
    try {
      const token = getToken();
      const { data } = await axios.post(
        "http://localhost:5000/api/bookshelf/addtoShelf",
        { ibn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status) {
        fetchBookshelf();
        setSearchResults((prev) => prev.filter((b) => b.ibn !== ibn));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-page">
      <div className="search-content-wrapper">
        <header className="search-header">
          <div className="icon-circle">
            <BookIcon />
          </div>
          <h1>My Bookshelf</h1>
          <p className="subtitle">Your curated library — organized beautifully.</p>

          <button
            className="search-toggle-btn"
            onClick={() => setShowSearch((p) => !p)}
            aria-expanded={showSearch}
          >
            {showSearch ? "Close" : "Add Book"}
          </button>
        </header>

        {showSearch && (
          <section className="card search-section" aria-label="Search books">
            <label htmlFor="book-search">Search by title</label>
            <p className="helper-text">Type a book title and click Search</p>

            <div className="search-input-group" role="search">
              <input
                id="book-search"
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              />
              <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>

            {/* Vertical list of results (stacked book-tile items) */}
            <div className="results-section" aria-live="polite">
              {searchResults.length === 0 && (
                <div className="no-results">No results yet.</div>
              )}


              {searchResults.map((book) => (
                <a key={book._id} className="search-card" href="#!" onClick={(e) => e.preventDefault()}>
                  <img src={book.cover_img || "/default-cover.png"} alt={book.title} />
                  <div className="book-details">
                    <div className="book-overview">
                      <div className="book-name">
                        <h2>{book.title}</h2>
                        <div className="book-meta">
                          <span className="author">{book.author}</span>
                          {book.year && <span className="year"> • {book.year}</span>}
                        </div>
                      </div>

                      <div className="book-rating">
                        <button
                          className="search-add-btn"
                          onClick={(e) => { e.preventDefault(); addToShelf(book.ibn); }}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Bookshelf grid with portrait book rectangles */}
        <section className="card">
          <h2 className="section-title">Your Collection</h2>

          <div className="bookshelf-grid">
            {bookshelf.length === 0 && <div className="no-results">Your bookshelf is empty.</div>}

            {bookshelf.map((book) => (
              <Link key={book._id} to={`/book/${book.ibn}`} className="book-rect-link">
                <div className="book-rect">
                  <img src={book.cover_img || "/default-cover.png"} alt={book.title} />
                  <div className="book-title">{book.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookshelfPage;
