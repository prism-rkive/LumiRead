import React, { useState, useEffect } from "react";
import api from "../../../../service/api";
import checkAuth from "../../../../service/auth";
import "./styles.css";
import StarRatings from "react-star-ratings";

function BookDetails({
  match: {
    params: { isbn },
  },
}) {
  const [data, setData] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    async function auth() {
      const res = await checkAuth();

      setSignedIn(res.signedIn);
      if (res.signedIn) {
        setToken(res.token);
        try {
          const resx = await api.post(
            "/userfind",
            { ibn: isbn },
            {
              headers: { Authorization: `Bearer ${res.token}` },
            }
          );
          if (resx.data) {
            console.log(resx.data);
            setData(resx.data);
            setReviewed(resx.data.isReviewed);
            setIsLiked(resx.data.isLiked);
          }
        } catch (e) {
          setData({ status: false, type: "catch", error: e });
        }
      } else {
        try {
          const resx = await api.post("/find", { ibn: isbn });
          if (resx.data) setData(resx.data);
        } catch (e) {
          setData({ status: false, type: "catch", error: e });
        }
      }
    }
    auth();
  }, [isbn]);

  const submitReview = async () => {
    if (rating === 0) {
      setMessage("Please select a rating!");
      return;
    }
    if (comment === "") {
      setMessage("Enter your review!");
      return;
    }
    try {
      const res = await api.post(
        "/addreview",
        {
          rating,
          comment,
          ibn: data.data.ibn,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      if (res.data.status) {
        window.location.reload();
      } else if (res.data.type === "exists")
        setMessage("You have already reviewed for this title");
      else if (res.data.auth_status === false) {
        setMessage("Authentication Error! Try refreshing!");
        return;
      } else setMessage("Unknown Error Occurred!");
    } catch (e) {
      setMessage("" + e);
    }
  };

  const likeHandler = async () => {
    setDisabled(true);
    try {
      const res = await api.post(
        "/user/likebook",
        {
          liked: isLiked,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.status) {
        setDisabled(false);
        if (isLiked) setIsLiked(false);
        else setIsLiked(true);
      }
    } catch (e) {
      setDisabled(false);
      console.log(e);
    }
  };

  return (
    <>
      {data !== null ? (
        data.status ? (
          <div className="Book-details">
            <div className="Book-cover">
              <img src={data.data.cover_img} alt={data.data.title} />
            </div>
            <div className="Book-review">
              <p>
                {signedIn ? (
                  <div className="userReviewPrompt">
                    <h4>My Review : </h4> <br />
                    {!reviewed ? (
                      <div className="userReviewBody">
                        <div className="userReviewTitle">
                          {data.data.reviews.length === 0
                            ? "Be the first to "
                            : ""}
                          Rate and Review {data.data.title}
                        </div>
                        <div className="userReviewContent">
                          <StarRatings
                            rating={rating}
                            starRatedColor="orange"
                            changeRating={(e) => {
                              setRating(e);
                            }}
                            starHoverColor="gold"
                            starDimension="30px"
                            starSpacing="0px"
                            numberOfStars={5}
                            name="rating"
                          />
                          <textarea
                            style={{ backgroundColor: "#fff" }}
                            value={comment}
                            onChange={(e) => {
                              setComment(e.target.value);
                            }}
                            required
                            placeholder="Write your review!"
                          />
                          <button
                            style={{ marginTop: "15px" }}
                            className="input-button"
                            onClick={submitReview}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="userReviewBody">
                        <div className="userReviewTitle">Your Review</div>
                        <div className="userReviewContent">
                          <StarRatings
                            rating={data.myReview.rating}
                            starRatedColor="orange"
                            starDimension="20px"
                            starSpacing="0px"
                            numberOfStars={5}
                            name="rating"
                          />
                          <div>{data.myReview.comment}</div>
                        </div>
                      </div>
                    )}
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "14px",
                      }}
                    >
                      {message}
                    </span>
                  </div>
                ) : (
                  <h4>Log In to review : </h4>
                )}
              </p>
            </div>
            <div className="Book-description">
              <p>
                <h3>{data.data.title}</h3>
                <h4>Description : </h4>
                <br />
                {data.data.description}
              </p>
            </div>
            <div className="Book-data">
              <p>
                <h2>Details :</h2>
                <br />
                <label>ISBN Number : {data.data.ibn}</label>
                <br />
                <label>Book title : {data.data.title}</label>
                <br />
                <label>Author Name : {data.data.author}</label>
                <br />
                <label>Language : {data.data.language}</label>
                <br />
                <label>Year of Publication : {data.data.year}</label>
                <br />
                <label>
                  Genre :{" "}
                  {data.data.genre.map((genre, index) => (
                    <a key={index} href={`/genre/${genre}`}>
                      <b>{genre}</b>
                      {index !== data.data.genre.length - 1 ? "," : ""}
                    </a>
                  ))}
                </label>
                <br />
                <label>
                  Buy At :{" "}
                  <a href={data.data.buy_url}>
                    <b>Amazon</b>
                  </a>
                </label>
              </p>
            </div>
            <div className="Book-reviews">
              <p>
                <h3>
                  Reviews :{" "}
                  {data.data.avg_rating > 0 || data.data.reviews.length > 0 ? (
                    <>
                      <div className="bookRating">
                        <StarRatings
                          rating={data.data.avg_rating}
                          starRatedColor="orange"
                          starDimension="15px"
                          starSpacing="0px"
                          numberOfStars={5}
                          name="rating"
                        />
                      </div>{" "}
                      <span style={{ color: "rgb(255 255 255)" }}>
                        {data.data.avg_rating}
                      </span>
                      <span style={{ color: "#000", marginLeft: "10px" }}>
                        From {data.data.reviews.length} Ratings
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </h3>
              </p>

              {data.data.reviews.length > 0 ? (
                data.data.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="user-review"
                    style={{
                      display: reviewed
                        ? review._id === data.myReview._id
                          ? "none"
                          : "flex"
                        : "flex",
                    }}
                  >
                    <p>
                      <h4>{review.name}</h4>

                      <StarRatings
                        rating={review.rating}
                        starRatedColor="orange"
                        starDimension="20px"
                        starSpacing="0px"
                        numberOfStars={5}
                        name="rating"
                      />
                      <br />
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="user-review">
                  <p>
                    <h4>No reviews yet !</h4>
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          "book not found"
        )
      ) : (
        "loading"
      )}
    </>
  );
}

export default BookDetails;