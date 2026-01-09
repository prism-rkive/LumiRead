import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Calendar,
  User,
  Globe,
  FileText,
  Building,
  ShoppingCart,
  BookPlus,
} from "lucide-react";

import Sidebar from "../../../Sidebar";
import api from "../../../../service/api";
import "./styles.css";

function BookDetails() {
  const { isbn } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [book, setBook] = useState(() => {
    const b = location.state?.bookData;
    if (!b) return null;
    // Normalize buy_url if coming from raw Google Books data
    if (!b.buy_url && b.saleInfo?.buyLink) {
      return { ...b, buy_url: b.saleInfo.buyLink };
    }
    return b;
  });
  const [loading, setLoading] = useState(!location.state?.bookData);
  const [error, setError] = useState(false);
  const [isInShelf, setIsInShelf] = useState(false);
  const [addingToShelf, setAddingToShelf] = useState(false);

  // Review states
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Community reviews
  const [communityReviews, setCommunityReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const getBookIsbn = useCallback(() => {
    const info = book?.volumeInfo || {};
    const isbnIdentifier = info.industryIdentifiers?.find(
      (id) => id.type === "ISBN_13" || id.type === "ISBN_10"
    );
    return isbnIdentifier?.identifier || isbn;
  }, [book, isbn]);

  const checkShelfStatus = useCallback(async () => {
    if (!currentUser.token) return;
    try {
      const { data } = await api.get("/api/bookshelf/mybooks", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (data.status && data.data) {
        const currentIsbn = getBookIsbn();
        const exists = data.data.some((b) => b.ibn === currentIsbn);
        setIsInShelf(exists);
      }
    } catch (e) {
      console.error("Error checking shelf status", e);
    }
  }, [currentUser.token, getBookIsbn]);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    const token = currentUser.token;
    if (!token) {
      setReviewsLoading(false);
      return;
    }

    try {
      const bookIsbn = getBookIsbn();
      const response = await api.get(`/reviews/${bookIsbn}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        const reviews = response.data.reviews || [];
        const uReview = reviews.find(
          (r) => (r.user_id?._id || r.user_id) === currentUser._id
        );
        const oReviews = reviews.filter(
          (r) => (r.user_id?._id || r.user_id) !== currentUser._id
        );

        if (uReview) {
          setMyReview({
            rating: uReview.rating,
            comment: uReview.comment,
            date: uReview.date,
          });
          setReviewRating(uReview.rating);
          setReviewText(uReview.comment || "");
        } else {
          setMyReview(null);
        }
        setCommunityReviews(oReviews);
      }
    } catch (err) {
      console.error("Reviews fetch failed", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [currentUser._id, currentUser.token, getBookIsbn]);

  const fetchBookDetails = useCallback(async () => {
    setLoading(true);
    let foundLocal = false;

    // 1. Try fetching from our local backend first
    try {
      // Ensure we are sending the ISBN as a string
      const { data } = await api.post("/getbook", { ibn: String(isbn) });

      if (data && data.status && data.data) {
        let dbBook = data.data;
        // Check if we need to supplement with Google Books data (for previewLink)
        if (!dbBook.previewLink) {
          try {
            const googleRes = await axios.get(
              `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
            );
            if (googleRes.data.items && googleRes.data.items.length > 0) {
              const gInfo = googleRes.data.items[0].volumeInfo || {};
              // Add previewLink from Google to our local book object
              dbBook = { ...dbBook, previewLink: gInfo.previewLink };
            }
          } catch (gErr) {
            console.error("Failed to fetch supplementary data from Google:", gErr);
          }
        }

        setBook({
          ...dbBook,
          // Map properties to match Google Books structure where needed by UI
          volumeInfo: {
            title: dbBook.title,
            authors: dbBook.author ? [dbBook.author] : [],
            description: dbBook.description,
            imageLinks: { thumbnail: dbBook.cover_img },
            language: dbBook.language,
            publishedDate: dbBook.year ? String(dbBook.year) : "",
            categories: Array.isArray(dbBook.genre) ? dbBook.genre : [dbBook.genre],
            publisher: dbBook.publisher,
            pageCount: dbBook.pages,
            previewLink: dbBook.previewLink,
          },
          // Ensure buy_url is explicitly available at top level
          buy_url: dbBook.buy_url,
        });
        foundLocal = true;
      }
    } catch (localErr) {
      console.error("Local fetch failed:", localErr);
    }

    // 2. If not found locally, fallback to Google Books
    if (!foundLocal) {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
        );
        if (res.data.items) {
          const gBook = res.data.items[0];
          setBook({
            ...gBook,
            buy_url: gBook.saleInfo?.buyLink,
          });
        } else {
          const resId = await axios.get(
            `https://www.googleapis.com/books/v1/volumes/${isbn}`
          );
          setBook({
            ...resId.data,
            buy_url: resId.data.saleInfo?.buyLink,
          });
        }
      } catch (err) {
        console.error("Google fetch failed:", err);
        setError(true);
      }
    }

    setLoading(false);
  }, [isbn]);

  useEffect(() => {
    if (!book) fetchBookDetails();
    else {
      fetchReviews();
      checkShelfStatus();
    }
  }, [book, fetchBookDetails, fetchReviews, checkShelfStatus]);

  const submitReview = async () => {
    if (reviewRating === 0) return alert("Please select a star rating");
    setSubmitting(true);
    try {
      const info = book.volumeInfo;
      const bookData = {
        title: info.title,
        ibn: getBookIsbn(),
        author: info.authors?.join(", "),
        cover_img: info.imageLinks?.thumbnail,
        description: info.description?.replace(/<[^>]*>/g, ""),
        language: info.language,
        year: info.publishedDate
          ? parseInt(info.publishedDate.split("-")[0])
          : null,
        genre: info.categories || [],
      };

      // Step 1: Ensure book exists
      try {
        await api.post("/addbook", bookData, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
      } catch (e) {
        console.log("Book exists");
      }

      // Step 2: Post review
      const res = await api.post(
        "/addreview",
        {
          ibn: bookData.ibn,
          rating: reviewRating,
          comment: reviewText,
        },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );

      if (res.data.status) {
        alert(myReview ? "Review Updated!" : "Review Posted!");
        setIsEditing(false);
        fetchReviews();
      }
    } catch (e) {
      alert("Error saving review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToShelf = async () => {
    if (!currentUser.token) return alert("Please login to add books to your shelf");
    setAddingToShelf(true);

    try {
      const info = book.volumeInfo;
      const bookData = {
        title: info.title,
        ibn: getBookIsbn(),
        author: info.authors?.join(", "),
        cover_img: info.imageLinks?.thumbnail,
        description: info.description?.replace(/<[^>]*>/g, ""),
        language: info.language,
        year: info.publishedDate
          ? parseInt(info.publishedDate.split("-")[0])
          : null,
        genre: info.categories || [],
      };

      // 1. Ensure book exists in DB
      try {
        await api.post("/addbook", bookData, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
      } catch (e) {
        // Ignore if exists
      }

      // 2. Add to Shelf
      const res = await api.post("/api/bookshelf/addtoShelf", { ibn: bookData.ibn }, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      if (res.data.status) {
        setIsInShelf(true);
        alert("Book added to your shelf!");
      } else {
        alert(res.data.message || "Failed to add to shelf");
      }

    } catch (err) {
      console.error("Add to shelf failed", err);
      alert("Something went wrong");
    } finally {
      setAddingToShelf(false);
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error || !book)
    return <div className="error-container">Book not found.</div>;

  const info = book.volumeInfo || {};

  return (
    <div className="book-details-page">
      <Sidebar />
      <div className="book-details-content">
        <div className="book-details-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back to Search
          </button>

          {/* Top Section */}
          <div className="book-header">
            <div className="book-cover-large">
              <img
                src={
                  info.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/300x450"
                }
                alt={info.title}
              />
            </div>
            <div className="book-main-info">
              <h1 className="book-title-large">{info.title}</h1>
              <p className="book-authors">
                <User size={18} /> {info.authors?.join(", ")}
              </p>

              <div className="book-meta">
                <div className="meta-item">
                  <Calendar size={16} /> Published: {info.publishedDate}
                </div>
                <div className="meta-item">
                  <FileText size={16} /> {info.pageCount} pages
                </div>
                <div className="meta-item">
                  <Globe size={16} /> Language: {info.language?.toUpperCase()}
                </div>
                <div className="meta-item">
                  <Building size={16} /> Publisher: {info.publisher}
                </div>
              </div>

              {info.categories && (
                <div className="book-categories">
                  {info.categories.map((c, i) => (
                    <span key={i} className="category-badge">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className="action-buttons">
                {info.previewLink && (
                  <a
                    href={info.previewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    <BookOpen size={18} /> Preview Book
                  </a>
                )}
                {(book.buy_url || book.saleInfo?.buyLink) && (
                  <a
                    href={book.buy_url || book.saleInfo?.buyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    <ShoppingCart size={18} /> Buy Now
                  </a>
                )}
                <a
                  href={`https://www.amazon.com/s?k=${encodeURIComponent(
                    (info.industryIdentifiers?.find(id => id.type === "ISBN_13" || id.type === "ISBN_10")?.identifier) ||
                    (info.title + " " + (info.authors?.join(" ") || ""))
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ backgroundColor: "#f97316", borderColor: "#f97316" }} // Orange for Amazon
                >
                  <ShoppingCart size={18} /> Buy on Amazon
                </a>
                {!isInShelf && (
                  <button
                    onClick={handleAddToShelf}
                    disabled={addingToShelf}
                    className="btn-secondary"
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
                  >
                    <BookPlus size={18} /> {addingToShelf ? "Adding..." : "Add to Shelf"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* About Section & Restored Additional Info Grid */}
          <div className="book-section">
            <h2 className="section-title">About This Book</h2>
            <div
              className="book-description"
              dangerouslySetInnerHTML={{ __html: info.description }}
            />

            <div className="additional-info-section">
              <h3
                className="section-title"
                style={{ fontSize: "1.2rem", marginTop: "1rem" }}
              >
                Additional Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>ISBN</strong> <span>{getBookIsbn()}</span>
                </div>
                <div className="info-item">
                  <strong>Publisher</strong>{" "}
                  <span>{info.publisher || "N/A"}</span>
                </div>
                <div className="info-item">
                  <strong>Pages</strong> <span>{info.pageCount || "N/A"}</span>
                </div>
                <div className="info-item">
                  <strong>Release Date</strong>{" "}
                  <span>{info.publishedDate || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Review Section */}
          <div className="book-section">
            <h2 className="section-title">
              {myReview && !isEditing ? "My Review" : "Rate this book"}
            </h2>

            {!isEditing && myReview ? (
              <div className="my-review-display">
                <div className="review-header">
                  <div className="stars-display">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={22}
                        fill={i < myReview.rating ? "gold" : "none"}
                        stroke={i < myReview.rating ? "gold" : "currentColor"}
                      />
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(myReview.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-text" style={{ margin: "1rem 0" }}>
                  {myReview.comment}
                </p>
                <button
                  className="edit-review-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Review
                </button>
              </div>
            ) : (
              <div className="write-review-container">
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={32}
                      className="star-icon"
                      fill={
                        s <= (hoverRating || reviewRating) ? "gold" : "none"
                      }
                      stroke={
                        s <= (hoverRating || reviewRating)
                          ? "gold"
                          : "currentColor"
                      }
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewRating(s)}
                    />
                  ))}
                </div>
                <textarea
                  className="review-textarea"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what you thought about this book..."
                />
                <div className="review-actions" style={{ marginTop: "1.5rem" }}>
                  <button
                    className="submit-review-btn"
                    onClick={submitReview}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : myReview
                        ? "Update Review"
                        : "Post Review"}
                  </button>
                  {isEditing && (
                    <button
                      className="cancel-review-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Community Section */}
          <div className="book-section">
            <h2 className="section-title">Community Reviews</h2>
            {communityReviews.length > 0 ? (
              communityReviews.map((r, i) => (
                <div key={i} className="community-review-item">
                  <div className="review-user-info">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_id?.name}`}
                      className="review-user-avatar"
                      alt="User"
                    />
                    <div>
                      <strong>{r.user_id?.name || "User"}</strong>
                      <div className="stars-display">
                        {[...Array(5)].map((_, idx) => (
                          <span
                            key={idx}
                            style={{ color: idx < r.rating ? "gold" : "#ccc" }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))
            ) : (
              <p>No community reviews yet.</p>
            )}
          </div>
          {/* Additional Information Section (Restored) */}
          <div className="additional-info-section">
            <h3 className="section-title" style={{ fontSize: "1.1rem" }}>
              Additional Information
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>ISBN</strong> <span>{getBookIsbn()}</span>
              </div>
              <div className="info-item">
                <strong>Page Count</strong> <span>{info.pageCount}</span>
              </div>
              <div className="info-item">
                <strong>Publisher</strong> <span>{info.publisher}</span>
              </div>
              <div className="info-item">
                <strong>Published Date</strong>{" "}
                <span>{info.publishedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
