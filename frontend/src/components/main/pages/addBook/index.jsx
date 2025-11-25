import React, { useState } from "react";
import api from "../../../../service/api";
import "./style.css";
import axios from "axios";
import checkAuth from "../../../../service/auth";

function Addbook() {
  const [message, setMessege] = useState("");
  const [ibn, setIbn] = useState("");
  const [ibnValid, setIbnValid] = useState(true);
  const [title, setTitle] = useState("");
  const [titleValid, setTitleValid] = useState(true);
  const [author, setAuthor] = useState("");
  const [authorValid, setAuthorValid] = useState(true);
  const [language, setLanguage] = useState("");
  const [languageValid, setLanguageValid] = useState(true);
  const [year, setYear] = useState("");
  const [yearValid, setYearValid] = useState(true);
  const [genre, setGenre] = useState("");
  const [genreValid, setGenreValid] = useState(true);
  const [description, setDescription] = useState("");
  const [descriptionValid, setDescriptionValid] = useState(true);
  const [buy_url, setLink] = useState("");
  const [linkValid, setLinkValid] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const logo_up = React.useRef(null);
  const [disable, setDisable] = useState(false);
  const [checkingBook, setCheckingBook] = useState(false);
  const [bookExists, setBookExists] = useState(false);
  const [existingBookData, setExistingBookData] = useState(null);
  const [checkMessage, setCheckMessage] = useState("");

  const checkIfBookExists = async () => {
    // Reset states
    setCheckMessage("");
    setBookExists(false);
    setExistingBookData(null);
    
    // Validate ISBN is entered
    if (ibn === "") {
      setCheckMessage("Please enter ISBN first");
      setIbnValid(false);
      return;
    }
    
    setIbnValid(true);
    setCheckingBook(true);
    
    try {
      const res = await api.post('/checkbook', { ibn });
      
      if (res.data.status && res.data.exists) {
        // Book exists
        setBookExists(true);
        setExistingBookData(res.data.book);
        setCheckMessage(`Book already exists: ${res.data.book.title}`);
      } else if (res.data.status && !res.data.exists) {
        // Book doesn't exist
        setBookExists(false);
        setCheckMessage("Book not found in database. You can add it!");
      } else {
        setCheckMessage("Error checking book");
      }
    } catch (error) {
      setCheckMessage("Error: " + error.message);
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
    let cover_img = "/dummy.jpg";
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
        return;
      }
    }
    try {
      const token = (await checkAuth()).token;
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
          genre,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setMessege("Book Added");
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
      } else if (res.data.type === "save") {
        setMessege("Book not added !");
        setDisable(false);
      }
    } catch (e) {
      setDisable(false);
      setMessege("" + e);
    }
  };

  return (
    <>
      <div className="Addbook">
        <div className="addbook-cover">
          <img
            className="b"
            id="logo_preview"
            src={preview ? preview : "/dummy.jpg"}
            alt=""
          />

          <input
            hidden
            accept="image/x-png,image/gif,image/jpeg"
            type="file"
            name="logo_url"
            ref={logo_up}
            onChange={(e) => {
              setImgUrl(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />

          <button
            className="input-button"
            onClick={() => logo_up.current.click()}
          >
            Upload Image
          </button>
        </div>
        <div className="addbook-container">
          <form className="addbook-form" onSubmit={handleBook}>
            <h2>Add Book</h2>
            <p>
              <label>ISBN Number : </label>
              <input
                className={
                  ibnValid ? "addbook-field" : "addbook-field has-error"
                }
                style={{ width: "30%" }}
                type="number"
                value={ibn}
                onChange={(e) => {
                  setIbn(e.target.value);
                  // Reset check when ISBN changes
                  setBookExists(false);
                  setCheckMessage("");
                }}
              />
              <button
                type="button"
                className="input-button"
                onClick={checkIfBookExists}
                disabled={checkingBook}
                style={{ marginLeft: "10px" }}
              >
                {checkingBook ? "Checking..." : "Check ISBN"}
              </button>
            </p>
            {checkMessage && (
              <p style={{ 
                color: bookExists ? "red" : "green",
                fontWeight: "bold",
                marginLeft: "150px"
              }}>
                {checkMessage}
                {bookExists && existingBookData && (
                  <a 
                    href={`/book/${existingBookData.ibn}`}
                    style={{ marginLeft: "10px", color: "blue" }}
                  >
                    View Book
                  </a>
                )}
              </p>
            )}
            <p>
              <label>Book title :</label>
              <input
                className={
                  titleValid ? "addbook-field" : "addbook-field has-error"
                }
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </p>
            <p>
              <label>Author Name : </label>
              <input
                className={
                  authorValid ? "addbook-field" : "addbook-field has-error"
                }
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
              />
            </p>
            <p>
              <label>Language : </label>
              <input
                className={
                  languageValid ? "addbook-field" : "addbook-field has-error"
                }
                style={{ width: "50%" }}
                type="text"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
              />
            </p>
            <p>
              <label>Year Of Publication :</label>
              <input
                className={
                  yearValid ? "addbook-field" : "addbook-field has-error"
                }
                style={{ width: "20%" }}
                type="number"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                }}
              />
            </p>
            <p>
              <label>Genre : </label>
              <input
                className={
                  genreValid ? "addbook-field" : "addbook-field has-error"
                }
                placeholder="romance,action,adventure,..."
                type="text"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value.split(","));
                }}
              />
            </p>
            <p>
              <label style={{ position: "relative", top: "-8em" }}>
                Description :
              </label>
              <textarea
                className={descriptionValid ? "" : "has-error"}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </p>
            <p>
              <label>Link to purchase : </label>
              <input
                className={
                  linkValid ? "addbook-field" : "addbook-field has-error"
                }
                placeholder="paste url here"
                type="url"
                value={buy_url}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </p>
            <p>
              <label>{message}</label>
              <button
                style={{ margin: "3em 2em 0 0" }}
                className="input-button"
                disabled={disable || bookExists}
                type="submit"
              >
                Add Book
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Addbook;