import React, { useState, useRef } from "react";
import api from "../../../../service/api";
import "./style.css";
import axios from "axios";
import checkAuth from "../../../../service/auth";

function Addbook() {
  const [message, setMessege] = useState("");
  const [ibn, setIbn] = useState("");
  const [ibnValid, setIbnValid] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [buy_url, setLink] = useState("");
  const [imgUrl, setImgUrl] = useState(null); // For file upload
  const [preview, setPreview] = useState(null); // For image preview
  const [externalImgUrl, setExternalImgUrl] = useState(null); // For Google Books image

  // Validation states
  const [titleValid, setTitleValid] = useState(true);
  const [authorValid, setAuthorValid] = useState(true);
  const [languageValid, setLanguageValid] = useState(true);
  const [yearValid, setYearValid] = useState(true);
  const [genreValid, setGenreValid] = useState(true);
  const [descriptionValid, setDescriptionValid] = useState(true);
  const [linkValid, setLinkValid] = useState(true);

  const logo_up = useRef(null);
  const [disable, setDisable] = useState(false);
  const [checkingBook, setCheckingBook] = useState(false);
  const [bookExists, setBookExists] = useState(false);
  const [existingBookData, setExistingBookData] = useState(null);
  const [checkMessage, setCheckMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleFetchData = async () => {
    // Reset states
    setCheckMessage("");
    setBookExists(false);
    setExistingBookData(null);
    setShowForm(false);
    setMessege("");

    // Validate ISBN is entered
    if (ibn === "") {
      setCheckMessage("Please enter ISBN first");
      setIbnValid(false);
      return;
    }

    setIbnValid(true);
    setCheckingBook(true);

    try {
      // 1. Check local database first
      const res = await api.post('/checkbook', { ibn });

      if (res.data.status && res.data.exists) {
        setBookExists(true);
        setExistingBookData(res.data.book);
        setCheckMessage(`Book already exists: ${res.data.book.title}`);
      } else {
        // 2. If not in DB, fetch from Google Books API
        try {
          const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ibn}`);

          if (googleRes.data.totalItems > 0) {
            const bookInfo = googleRes.data.items[0].volumeInfo;

            setTitle(bookInfo.title || "");
            setAuthor(bookInfo.authors ? bookInfo.authors.join(", ") : "");
            setLanguage(bookInfo.language || "");
            setYear(bookInfo.publishedDate ? bookInfo.publishedDate.substring(0, 4) : "");
            setGenre(bookInfo.categories ? bookInfo.categories.join(",") : "");
            setDescription(bookInfo.description || "");

            if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail) {
              setExternalImgUrl(bookInfo.imageLinks.thumbnail);
              setPreview(bookInfo.imageLinks.thumbnail);
            } else {
              setExternalImgUrl(null);
              setPreview(null);
            }

            setShowForm(true);
            setCheckMessage("Book details fetched successfully!");
          } else {
            setCheckMessage("Book not found in Google database. Please enter details manually.");
            // Clear fields for manual entry
            setTitle("");
            setAuthor("");
            setLanguage("");
            setYear("");
            setGenre("");
            setDescription("");
            setExternalImgUrl(null);
            setPreview(null);
            setShowForm(true);
          }
        } catch (googleError) {
          console.error("Google Books API Error:", googleError);
          setCheckMessage("Error fetching from Google Books. Please enter details manually.");
          setShowForm(true);
        }
      }
    } catch (error) {
      setCheckMessage("Error checking database: " + error.message);
    }

    setCheckingBook(false);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setIbnValid(true);
    setTitleValid(true);
    setAuthorValid(true);
    setLanguageValid(true);
    setYearValid(true);
    setGenreValid(true);
    setDescriptionValid(true);
    setLinkValid(true);
    setDisable(true);

    // Validation checks...
    if (ibn === "") { setIbnValid(false); setMessege("Invalid ISBN !"); setDisable(false); return; }
    if (title === "") { setTitleValid(false); setMessege("Title empty !"); setDisable(false); return; }
    if (author === "") { setAuthorValid(false); setMessege("Author empty !"); setDisable(false); return; }
    if (language === "") { setLanguageValid(false); setMessege("Language empty !"); setDisable(false); return; }
    if (year === "" || year < 1000) { setYearValid(false); setMessege("Invalid year !"); setDisable(false); return; }
    if (genre === "") { setGenreValid(false); setMessege("Genre empty !"); setDisable(false); return; }
    if (description === "") { setDescriptionValid(false); setMessege("No description !"); setDisable(false); return; }
    if (buy_url === "") { setLinkValid(false); setMessege("No purchase url !"); setDisable(false); return; }

    let cover_img = externalImgUrl || "/dummy.jpg";

    // If user uploaded a new image, upload it to imgbb
    if (imgUrl !== null) {
      let body = new FormData();
      body.set("key", "43f9e6a0ce735567a97229ceb1fa8ad6");
      body.append("image", imgUrl);

      try {
        let imgbb = await axios({
          method: "post",
          url: "https://api.imgbb.com/1/upload",
          data: body,
        });
        cover_img = imgbb.data.data.url;
      } catch (e) {
        setMessege("Image upload failed");
        setDisable(false);
        return;
      }
    }

    try {
      const authData = await checkAuth();
      if (!authData.signedIn || !authData.token) {
        setMessege("Please login to add a book");
        setDisable(false);
        return;
      }

      const token = authData.token;
      const res = await api.post(
        "/addbook",
        {
          ibn,
          title,
          author,
          language,
          cover_img,
          description,
          buy_url,
          year,
          genre: Array.isArray(genre) ? genre : genre.split(","),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status) {
        setMessege("Book Added Successfully!");
        setDisable(false);
        // Optional: clear form or redirect
      } else if (res.data.type === "empty") {
        setIbnValid(false);
        setMessege("Check ISBN !");
        setDisable(false);
      } else if (res.data.type === "exists") {
        setMessege("Book already exists !");
        setDisable(false);
      } else if (res.data.type === "userdoesntexist") {
        setMessege("Please login again !");
        setDisable(false);
      } else if (res.data.type === "save") {
        setMessege("Book not added !");
        setDisable(false);
      } else {
        // Handle generic error or auth failure from backend
        setMessege(res.data.message || "An error occurred");
        setDisable(false);
      }
    } catch (e) {
      setDisable(false);
      setMessege("Error: " + e.message);
    }
  };

  return (
    <div className="addbook-page">
      <div className="addbook-content-wrapper">
        <div className="addbook-header">
          <div className="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Add a New Book</h1>
          <p className="subtitle">Enter the ISBN to fetch book details, then add a purchase link</p>
        </div>

        <div className="isbn-section card">
          <label>ISBN Number</label>
          <p className="helper-text">Enter the 10 or 13 digit ISBN number</p>
          <div className="isbn-input-group">
            <input
              type="number"
              value={ibn}
              placeholder="978-0525559474"
              className={ibnValid ? "" : "error"}
              onChange={(e) => {
                setIbn(e.target.value);
                setBookExists(false);
                setCheckMessage("");
              }}
            />
            <button
              className="fetch-btn"
              onClick={handleFetchData}
              disabled={checkingBook}
            >
              {checkingBook ? "Checking..." : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Fetch Data
                </>
              )}
            </button>
          </div>
          {checkMessage && (
            <div className={`status-message ${bookExists ? 'error' : 'success'}`}>
              {checkMessage}
              {bookExists && existingBookData && (
                <a href={`/book/${existingBookData.ibn}`} className="view-link">View Book</a>
              )}
            </div>
          )}
        </div>

        {!showForm && !bookExists && (
          <div className="how-it-works card">
            <div className="icon-circle small">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B4513" strokeWidth="2">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="content">
              <h3>How it works</h3>
              <ol>
                <li>Enter the ISBN number of the book you want to add</li>
                <li>Click "Fetch Data" to retrieve book information automatically</li>
                <li>Review the fetched details and add a purchase link</li>
                <li>Submit to add the book to your library</li>
              </ol>
            </div>
          </div>
        )}

        {showForm && !bookExists && (
          <div className="book-details-form card fade-in">
            <h3>Book Details</h3>
            <form onSubmit={handleBook}>
              <div className="form-row">
                <div className="image-upload-section">
                  <img
                    src={preview ? preview : "/dummy.jpg"}
                    alt="Book Cover"
                    className="book-cover-preview"
                  />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    ref={logo_up}
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setImgUrl(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                        setExternalImgUrl(null); // Clear external URL if manual upload
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => logo_up.current.click()}
                  >
                    Change Cover
                  </button>
                </div>

                <div className="fields-section">
                  <div className="form-group">
                    <label>Book Title</label>
                    <input
                      type="text"
                      value={title}
                      className={titleValid ? "" : "error"}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Author Name</label>
                    <input
                      type="text"
                      value={author}
                      className={authorValid ? "" : "error"}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>

                  <div className="form-row-split">
                    <div className="form-group">
                      <label>Language</label>
                      <input
                        type="text"
                        value={language}
                        className={languageValid ? "" : "error"}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="number"
                        value={year}
                        className={yearValid ? "" : "error"}
                        onChange={(e) => setYear(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Genre (comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(genre) ? genre.join(",") : genre}
                      className={genreValid ? "" : "error"}
                      onChange={(e) => setGenre(e.target.value)}
                      placeholder="romance, action, adventure"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  className={descriptionValid ? "" : "error"}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Purchase Link</label>
                <input
                  type="url"
                  value={buy_url}
                  className={linkValid ? "" : "error"}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="form-actions">
                <span className="message">{message}</span>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={disable}
                >
                  Add Book to Library
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Addbook;
