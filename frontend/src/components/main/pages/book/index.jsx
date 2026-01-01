import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../service/api";
import "./styles.css";

function BookDetails() {
  const { ibn } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [myReview, setMyReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.post("/getbook", { ibn });
        if (res.data.status) {
          setBook(res.data.data);
          // Check if current user has reviewed and set state
          if (currentUser._id && res.data.data.reviews) {
            const userReview = res.data.data.reviews.find(r =>
              (r.user_id && r.user_id._id === currentUser._id) || r.user_id === currentUser._id
            );
            if (userReview) {
              setMyReview(userReview);
              setReviewRating(userReview.rating);
              setReviewText(userReview.comment || "");
            }
          }
        } else {
          setError(res.data.message || "Book not found");
        }
      } catch (e) {
        setError("Error fetching book details");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (ibn) {
      fetchBook();
    }
  }, [ibn]);

  const submitReview = async () => {
    if (reviewRating === 0) {
      alert("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const token = currentUser.token; // Assuming token is in currentUser object
      if (!token) {
        alert("You must be logged in to review");
        return;
      }

      const res = await api.post("/addreview", {
        ibn,
        rating: reviewRating,
        comment: reviewText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.status) {
        setBook(res.data.data); // Update book with new reviews

        setMyReview({
          ...myReview,
          rating: reviewRating,
          comment: reviewText,
          date: Date.now()
        });
        setIsEditing(false);
        alert(myReview ? "Review updated!" : "Review posted successfully!");
      } else {
        alert(res.data.message || "Failed to submit review");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="book-details-page"><div className="book-details-wrapper">Loading...</div></div>;
  if (error) return <div className="book-details-page"><div className="book-details-wrapper">{error}</div></div>;
  if (!book) return null;

  return (
    <div className="book-details-page">
      <div className="book-details-wrapper">
        <div className="book-cover-section">
          <img
            src={book.cover_img || "/dummy.jpg"}
            alt={book.title}
            className="book-cover-img"
          />
          <div className="book-actions">
            {book.buy_url && (
              <a href={book.buy_url} target="_blank" rel="noopener noreferrer" className="buy-btn">
                Buy Now
              </a>
            )}
          </div>
        </div>

        <div className="book-info-section">
          <h1 className="book-title">{book.title}</h1>
          <div className="book-author">
            by <b>{book.author}</b>
          </div>

          <div className="book-meta">
            <div className="rating-container">
              <span className="rating-star">★</span>
              <span>{book.avg_rating ? book.avg_rating.toFixed(2) : 0}</span>
            </div>
            <span className="meta-divider">•</span>
            <span>{book.reviews ? book.reviews.length : 0} ratings</span>
            <span className="meta-divider">•</span>
            <span>{book.year}</span>
          </div>

          <div className="description-section">
            <span className="section-title">About this book</span>
            <div className="book-description">
              {book.description}
            </div>
          </div>

          <div className="book-details-grid">
            <div className="detail-row">
              <span className="detail-label">ISBN</span>
              <span className="detail-value">{book.ibn}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Language</span>
              <span className="detail-value">{book.language}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Genres</span>
              <div className="genre-tags">
                {book.genre && book.genre.map((g, i) => (
                  <span key={i} className="genre-tag">{g}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2 className="section-title">
              {myReview && !isEditing ? "My Review" : "Rate this book"}
            </h2>

            <div className="write-review-container">
              {!isEditing && myReview ? (
                <div className="my-review-display">
                  <div className="review-header">
                    <div className="date-stars-row">
                      <div className="review-stars display-mode">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star-display ${i < myReview.rating ? "filled" : ""}`}>★</span>
                        ))}
                      </div>
                      <span className="review-date">
                        {new Date(myReview.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <button
                      className="edit-review-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Review
                    </button>
                  </div>
                  <div className="review-content-display">
                    {myReview.comment ? (
                      <p className="review-text">{myReview.comment}</p>
                    ) : (
                      <p className="no-comment-text">No written review.</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="user-review-header">
                    <span className="write-review-title">What do you think?</span>
                  </div>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-input ${star <= (hoverRating || reviewRating) ? "active" : ""}`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    className="review-textarea"
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <div className="review-actions">
                    <button
                      className="submit-review-btn"
                      onClick={submitReview}
                      disabled={submitting}
                    >
                      {submitting ? "Posting..." : (myReview ? "Update Review" : "Post Review")}
                    </button>
                    {isEditing && (
                      <button
                        className="cancel-review-btn"
                        onClick={() => setIsEditing(false)}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Community Reviews Section */}
          <div className="community-reviews-section">
            <h2 className="section-title">Community Reviews</h2>
            <div className="reviews-list">
              {book.reviews && book.reviews.length > 0 ? (
                book.reviews
                  .filter(r => (r.user_id?._id || r.user_id) !== currentUser._id)
                  .map((review, index) => (
                    <div key={index} className="community-review-item">
                      <div className="review-user-info">
                        <img
                          src={review.user_id?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (review.user_id?.name || "User")}
                          alt="User Avatar"
                          className="review-user-avatar"
                        />
                        <div className="review-user-details">
                          <span className="review-user-name">{review.user_id?.name || "Anonymous User"}</span>
                          <div className="review-stars-display">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`star-display ${i < review.rating ? "filled" : ""}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <span className="review-date-small">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="community-review-text">{review.comment || (<i>No written review.</i>)}</p>
                    </div>
                  ))
              ) : (
                <p className="no-reviews-msg">No community reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookDetails;