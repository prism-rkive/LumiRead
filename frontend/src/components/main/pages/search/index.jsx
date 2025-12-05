import React, { useState } from "react";
import api from "../../../../service/api";
import "./style.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.post("/search", { query });
      if (res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
      setData({ status: false });
    }
    setLoading(false);
  };

  return (
    <div className="search-page">
      <div className="search-content-wrapper">
        <div className="search-header">
          <div className="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Search Books</h1>
          <p className="subtitle">Find your next favorite read by title</p>
        </div>

        <div className="search-section card">
          <label>Book Title</label>
          <p className="helper-text">Enter the name of the book you are looking for</p>
          <form onSubmit={handleSearch} className="search-input-group">
            <input
              type="text"
              value={query}
              placeholder="e.g. The Great Gatsby"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="search-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        <div className="results-section">
          {searched && (
            <>
              {data && data.status && data.data.length > 0 ? (
                data.data.map((book, index) => (
                  <a href={"/book/" + book.ibn} key={index} className="book-tile">
                    <img src={book.cover_img || "/dummy.jpg"} alt={book.title} />
                    <div className="book-details">
                      <div className="book-overview">
                        <div className="book-name">
                          <h2>{book.title}</h2>
                          <b>{book.author}</b>
                        </div>
                        <div className="book-rating">
                          <h2>{book.avg_rating || 0}</h2>
                          <b>({book.reviews ? book.reviews.length : 0})</b>
                        </div>
                      </div>
                      <p className="book-description">
                        <b>Description:</b> <br />
                        {book.description}
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <div className="no-results card">
                  <p>{loading ? "Searching..." : "No books found matching your query."}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;