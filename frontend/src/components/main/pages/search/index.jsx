import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";
import {
  Search,
  Star,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Filter,
  X,
} from "lucide-react";
import Sidebar from "../../../Sidebar";

function SearchPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [trendingBooks, setTrendingBooks] = useState([]);
  const [mostReadBooks, setMostReadBooks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  const genres = [
    "all",
    "fiction",
    "mystery",
    "romance",
    "science fiction",
    "fantasy",
    "thriller",
    "horror",
    "biography",
    "history",
    "self-help",
    "business",
    "poetry",
  ];

  useEffect(() => {
    fetchInitialBooks();
  }, []);

  // Auto-search when filters change (if already searched)
  useEffect(() => {
    if (searched) {
      const timer = setTimeout(() => {
        handleSearchWithoutEvent();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedGenre, selectedAuthor]);

  // Filter valid books (title + thumbnail)
  const filterValidBooks = (items) =>
    (items || []).filter(
      (book) =>
        book.volumeInfo &&
        book.volumeInfo.title &&
        book.volumeInfo.imageLinks?.thumbnail
    );

  const fetchInitialBooks = async () => {
    setInitialLoading(true);
    try {
      const [trending, mostRead, newBooks] = await Promise.all([
        axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=12`
        ),
        axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=bestseller&orderBy=relevance&maxResults=40`
        ),
        axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=subject:thriller&orderBy=newest&maxResults=12`
        ),
      ]);

      setTrendingBooks(filterValidBooks(trending.data.items));
      setMostReadBooks(filterValidBooks(mostRead.data.items));
      setNewReleases(filterValidBooks(newBooks.data.items));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearchWithoutEvent = async () => {
    setLoading(true);
    setSearched(true);

    try {
      let searchQuery = "";

      if (query.trim()) {
        searchQuery = query.trim();
      } else if (selectedGenre === "bestseller-special") {
        // special query to return many bestsellers
        searchQuery = "bestseller";
      } else if (selectedGenre !== "all") {
        searchQuery = `subject:${selectedGenre}`;
      } else {
        searchQuery = "books";
      }

      if (
        selectedGenre !== "all" &&
        query.trim() &&
        selectedGenre !== "bestseller-special"
      ) {
        searchQuery += ` subject:${selectedGenre}`;
      }

      if (selectedAuthor.trim()) {
        searchQuery += ` inauthor:${selectedAuthor}`;
      }

      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=40`
      );

      setSearchResults(filterValidBooks(response.data.items));
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await handleSearchWithoutEvent();
  };

  const clearSearch = () => {
    setQuery("");
    setSearched(false);
    setSearchResults([]);
    setSelectedGenre("all");
    setSelectedAuthor("");
  };

  const handleBookClick = (book) => {
    const isbn =
      book.volumeInfo.industryIdentifiers?.[0]?.identifier || book.id;
    navigate(`/book/${isbn}`, { state: { bookData: book } });
  };

  // Custom handler for Most Read VIEW ALL
  const handleViewAllMostRead = async () => {
    setSearched(true);
    setQuery("");
    setSelectedGenre("bestseller-special"); // special internal flag
    setSelectedAuthor("");
    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=bestseller&orderBy=relevance&maxResults=40`
      );
      setSearchResults(filterValidBooks(response.data.items));
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = (genreQuery) => {
    if (genreQuery === "bestseller") {
      handleViewAllMostRead();
    } else {
      setQuery("");
      setSelectedGenre(genreQuery);
      setSelectedAuthor("");
      setSearched(true);
      handleSearchWithoutEvent();
    }
  };

  const BookCard = ({ book }) => {
    const info = book.volumeInfo;
    return (
      <div className="explore-book-card" onClick={() => handleBookClick(book)}>
        <div className="explore-book-cover">
          <img
            src={
              info.imageLinks?.thumbnail ||
              "https://via.placeholder.com/128x192?text=No+Cover"
            }
            alt={info.title}
          />
        </div>
        <div className="explore-book-info">
          <h3 className="explore-book-title">{info.title}</h3>
          <p className="explore-book-author">
            {info.authors?.[0] || "Unknown Author"}
          </p>
        </div>
      </div>
    );
  };

  const BookSection = ({ title, icon, books, onViewAll }) => (
    <div className="book-section">
      <div className="section-header-explore">
        <div className="section-title-wrapper">
          {icon}
          <h2>{title}</h2>
        </div>
        <button className="view-all-btn" onClick={onViewAll}>
          VIEW ALL →
        </button>
      </div>
      <div className="books-grid-explore">
        {books.slice(0, 12).map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="search-page">
      <Sidebar />
      <div className="search-content">
        <div className="search-container">
          <div className="search-header">
            <h1>
              Explore <span className="highlight">Books</span>
            </h1>
            <p className="subtitle">
              Discover thousands of books from around the world
            </p>

            <form onSubmit={handleSearch}>
              <div className="search-bar-wrapper">
                <div className="search-input-group">
                  <Search className="search-icon-main" size={20} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search thousands of titles..."
                    className="search-input-main"
                  />
                  {query && (
                    <button
                      type="button"
                      className="clear-btn"
                      onClick={clearSearch}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={18} />
                  Filters
                </button>
                <button
                  type="submit"
                  className="search-btn-main"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Explore"}
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="filters-panel">
                <div className="filter-group">
                  <label>Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="filter-select"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    placeholder="Filter by author name..."
                    className="filter-input"
                  />
                </div>
              </div>
            )}
          </div>

          {searched && (
            <div className="search-results-section">
              <button
                className="back-to-main-btn"
                onClick={() => setSearched(false)}
              >
                ← Back to Explore
              </button>

              <div className="results-header">
                <div className="section-title-wrapper">
                  <Search size={24} />
                  <h2>Search Results</h2>
                </div>
                <span className="results-count">
                  {searchResults.length} books found
                </span>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner-large"></div>
                  <p>Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="books-grid-explore">
                  {searchResults.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="no-results-card">
                  <AlertCircle size={48} />
                  <h3>No books found</h3>
                  <p>Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          )}

          {!searched && (
            <>
              {initialLoading ? (
                <div className="loading-state">
                  <div className="spinner-large"></div>
                  <p>Loading books...</p>
                </div>
              ) : (
                <>
                  <BookSection
                    title="Trending Now"
                    icon={<TrendingUp size={24} />}
                    books={trendingBooks}
                    onViewAll={() => handleViewAll("fiction")}
                  />

                  <BookSection
                    title="Most Read"
                    icon={<Star size={24} />}
                    books={mostReadBooks}
                    onViewAll={() => handleViewAll("bestseller")}
                  />

                  <BookSection
                    title="New Releases"
                    icon={<Sparkles size={24} />}
                    books={newReleases}
                    onViewAll={() => handleViewAll("thriller")}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
