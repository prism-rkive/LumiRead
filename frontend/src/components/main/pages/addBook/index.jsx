import React, { useState, useRef } from "react";
import api from "../../../../service/api";
import "./style.css";
import axios from "axios";
import checkAuth from "../../../../service/auth";
import {
  BookOpen,
  Search,
  Upload,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Sidebar from "../../../Sidebar";

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
  const [imgUrl, setImgUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [externalImgUrl, setExternalImgUrl] = useState(null);

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
    setCheckMessage("");
    setBookExists(false);
    setExistingBookData(null);
    setShowForm(false);
    setMessege("");

    if (ibn === "") {
      setCheckMessage("Please enter ISBN first");
      setIbnValid(false);
      return;
    }

    setIbnValid(true);
    setCheckingBook(true);

    try {
      const res = await api.post("/checkbook", { ibn });

      if (res.data.status && res.data.exists) {
        setBookExists(true);
        setExistingBookData(res.data.book);
        setCheckMessage(`Book already exists: ${res.data.book.title}`);
      } else {
        try {
          const googleRes = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${ibn}`
          );

          if (googleRes.data.totalItems > 0) {
            const bookInfo = googleRes.data.items[0].volumeInfo;

            setTitle(bookInfo.title || "");
            setAuthor(bookInfo.authors ? bookInfo.authors.join(", ") : "");
            setLanguage(bookInfo.language || "");
            setYear(
              bookInfo.publishedDate
                ? bookInfo.publishedDate.substring(0, 4)
                : ""
            );
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
            setCheckMessage(
              "Book not found in Google database. Please enter details manually."
            );
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
          setCheckMessage(
            "Error fetching from Google Books. Please enter details manually."
          );
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

    if (ibn === "") {
      setIbnValid(false);
      setMessege("Invalid ISBN !");
      setDisable(false);
      return;
    }
    if (title === "") {
      setTitleValid(false);
      setMessege("Title empty !");
      setDisable(false);
      return;
    }
    if (author === "") {
      setAuthorValid(false);
      setMessege("Author empty !");
      setDisable(false);
      return;
    }
    if (language === "") {
      setLanguageValid(false);
      setMessege("Language empty !");
      setDisable(false);
      return;
    }
    if (year === "" || year < 1000) {
      setYearValid(false);
      setMessege("Invalid year !");
      setDisable(false);
      return;
    }
    if (genre === "") {
      setGenreValid(false);
      setMessege("Genre empty !");
      setDisable(false);
      return;
    }
    if (description === "") {
      setDescriptionValid(false);
      setMessege("No description !");
      setDisable(false);
      return;
    }
    if (buy_url === "") {
      setLinkValid(false);
      setMessege("No purchase url !");
      setDisable(false);
      return;
    }

    let cover_img = externalImgUrl || "/dummy.jpg";

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
      <Sidebar />

      <div className="addbook-content">
        <div className="addbook-container">
          {/* Header Section */}
          <div className="addbook-header">
            <h1>
              Add a New <span className="highlight">Book</span>
            </h1>
            <p className="subtitle">
              Enter the ISBN to fetch book details, then add a purchase link
            </p>
          </div>

          {/* ISBN Search Card */}
          <div className="isbn-card">
            <div className="isbn-card-header">
              <Search size={20} />
              <h2>ISBN Lookup</h2>
            </div>

            <div className="isbn-input-wrapper">
              <input
                type="number"
                value={ibn}
                placeholder="978-0525559474"
                className={`isbn-input ${!ibnValid ? "error" : ""}`}
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
                {checkingBook ? (
                  <>
                    <div className="spinner" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search size={18} /> Fetch Data
                  </>
                )}
              </button>
            </div>

            {checkMessage && (
              <div
                className={`status-alert ${bookExists ? "error" : "success"}`}
              >
                {bookExists ? (
                  <AlertCircle size={18} />
                ) : (
                  <CheckCircle size={18} />
                )}
                <span>{checkMessage}</span>
                {bookExists && existingBookData && (
                  <a
                    href={`/book/${existingBookData.ibn}`}
                    className="view-book-link"
                  >
                    <ExternalLink size={16} /> View Book
                  </a>
                )}
              </div>
            )}
          </div>

          {/* How it Works */}
          {!showForm && !bookExists && (
            <div className="info-card">
              <div className="info-icon">
                <BookOpen size={24} />
              </div>
              <div className="info-content">
                <h3>How it works</h3>
                <ol>
                  <li>Enter the ISBN number of the book you want to add</li>
                  <li>
                    Click "Fetch Data" to retrieve book information
                    automatically
                  </li>
                  <li>Review the fetched details and add a purchase link</li>
                  <li>Submit to add the book to your library</li>
                </ol>
              </div>
            </div>
          )}

          {/* Book Details Form */}
          {showForm && !bookExists && (
            <div className="form-card">
              <div className="form-card-header">
                <BookOpen size={20} />
                <h2>Book Details</h2>
              </div>

              <form onSubmit={handleBook}>
                <div className="form-layout">
                  {/* Image Section */}
                  <div className="image-section">
                    <div className="image-preview-wrapper">
                      <img
                        src={preview ? preview : "/dummy.jpg"}
                        alt="Book Cover"
                        className="cover-preview"
                      />
                    </div>
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      ref={logo_up}
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setImgUrl(e.target.files[0]);
                          setPreview(URL.createObjectURL(e.target.files[0]));
                          setExternalImgUrl(null);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => logo_up.current.click()}
                    >
                      <Upload size={16} /> Change Cover
                    </button>
                  </div>

                  {/* Fields Section */}
                  <div className="fields-section">
                    <div className="form-group">
                      <label>Book Title *</label>
                      <input
                        type="text"
                        value={title}
                        className={!titleValid ? "error" : ""}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter book title"
                      />
                    </div>

                    <div className="form-group">
                      <label>Author Name *</label>
                      <input
                        type="text"
                        value={author}
                        className={!authorValid ? "error" : ""}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Language *</label>
                        <input
                          type="text"
                          value={language}
                          className={!languageValid ? "error" : ""}
                          onChange={(e) => setLanguage(e.target.value)}
                          placeholder="e.g. English"
                        />
                      </div>
                      <div className="form-group">
                        <label>Year *</label>
                        <input
                          type="number"
                          value={year}
                          className={!yearValid ? "error" : ""}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="2024"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Genre (comma separated) *</label>
                      <input
                        type="text"
                        value={Array.isArray(genre) ? genre.join(",") : genre}
                        className={!genreValid ? "error" : ""}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="romance, action, adventure"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        value={description}
                        className={!descriptionValid ? "error" : ""}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        placeholder="Enter book description"
                      />
                    </div>

                    <div className="form-group">
                      <label>Purchase Link *</label>
                      <input
                        type="url"
                        value={buy_url}
                        className={!linkValid ? "error" : ""}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  {message && (
                    <div
                      className={`form-message ${
                        message.includes("Success") ? "success" : "error"
                      }`}
                    >
                      {message.includes("Success") ? (
                        <CheckCircle size={18} />
                      ) : (
                        <AlertCircle size={18} />
                      )}
                      <span>{message}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={disable}
                  >
                    {disable ? (
                      <>
                        <div className="spinner" />
                        Adding Book...
                      </>
                    ) : (
                      <>
                        <BookOpen size={18} /> Add Book to Library
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Addbook;
