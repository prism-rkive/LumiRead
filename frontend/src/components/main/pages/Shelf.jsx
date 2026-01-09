import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpen, Search, Plus, X, Trash2, AlertCircle } from "lucide-react";
import Sidebar from "../../Sidebar";
import "./BookshelfPage.css";

const BookshelfPage = () => {
  const navigate = useNavigate();
  const [bookshelf, setBookshelf] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Failed to load bookshelf");
    }
  };

  useEffect(() => {
    fetchBookshelf();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const { data } = await axios.get(
        `http://localhost:5000/api/bookshelf/search?title=${encodeURIComponent(
          searchQuery
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status) setSearchResults(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to search books");
    } finally {
      setLoading(false);
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
      setError("Failed to add book");
    }
  };

  const removeFromShelf = async (bookId) => {
    if (!window.confirm("Remove this book from your shelf?")) return;
    try {
      const token = getToken();
      const { data } = await axios.delete(
        `http://localhost:5000/api/bookshelf/${bookId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status) {
        setBookshelf((prev) => prev.filter((book) => book._id !== bookId));
        setError("");
      } else {
        setError(data.message || "Failed to remove book");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove book");
    }
  };

  return (
    <div className="bookshelf-page">
      <Sidebar />

      <div className="bookshelf-content">
        <div className="bookshelf-container">
          {/* Header Section */}
          <div className="bookshelf-header">
            <h1>
              My <span className="highlight">Bookshelf</span>
            </h1>
            <p className="subtitle">
              Your curated library — organized beautifully.
            </p>

            <button
              className="toggle-search-btn"
              onClick={() => setShowSearch((p) => !p)}
            >
              {showSearch ? (
                <>
                  <X size={20} /> Close Search
                </>
              ) : (
                <>
                  <Plus size={20} /> Add Book
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* Search Section */}
          {showSearch && (
            <div className="search-card">
              <div className="search-card-header">
                <Search size={20} />
                <h2>Search Books</h2>
              </div>

              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="search-input"
                />
                <button
                  className="search-btn"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner" />
                  ) : (
                    <>
                      <Search size={18} /> Search
                    </>
                  )}
                </button>
              </div>

              {/* Search Results */}
              <div className="search-results">
                {searchResults.length === 0 && searchQuery && !loading && (
                  <div className="no-results">No results found</div>
                )}

                {searchResults.map((book) => (
                  <div key={book._id} className="result-item">
                    <img
                      src={book.cover_img || "/default-cover.png"}
                      alt={book.title}
                      className="result-cover"
                    />
                    <div className="result-details">
                      <h3>{book.title}</h3>
                      <p className="result-author">{book.author}</p>
                      {book.year && <p className="result-year">{book.year}</p>}
                    </div>
                    <button
                      className="add-btn"
                      onClick={() => addToShelf(book.ibn)}
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookshelf Collection */}
          <div className="collection-section">
            <div className="collection-header">
              <BookOpen size={24} />
              <h2>Your Collection</h2>
              <span className="book-count">{bookshelf.length} books</span>
            </div>

            {bookshelf.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} />
                <p>Your bookshelf is empty</p>
                <button
                  className="empty-state-btn"
                  onClick={() => setShowSearch(true)}
                >
                  <Plus size={18} /> Add Your First Book
                </button>
              </div>
            ) : (
              <div className="bookshelf-grid">
                {bookshelf.map((book) => (
                  <div key={book._id} className="book-card">
                    <div className="book-card-inner">
                      <img
                        src={book.cover_img || "/default-cover.png"}
                        alt={book.title}
                        className="book-cover"
                        onClick={() => navigate(`/book/${book.ibn}`)}
                        style={{ cursor: "pointer" }}
                      />
                      <button
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromShelf(book._id);
                        }}
                        title="Remove book"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookshelfPage;
