import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../../service/api";
import "./styles.css";

function BookDetails() {
  const { ibn } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.post("/getbook", { ibn });
        if (res.data.status) {
          setBook(res.data.data);
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
              <span>{book.avg_rating || 0}</span>
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
        </div>
      </div>
    </div>
  );
}

export default BookDetails;