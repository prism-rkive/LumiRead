import React, { useEffect, useState } from "react";
import api from "../../../../service/api";
import "./style.css";

function LandingPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function getData() {
      try {
        const res = await api.post("/view", { genre: "all" });
        if (res.data) {
          setData(res.data);
        }
      } catch (e) {
        setData({ status: false });
      }
    }
    getData();
  }, []);
  return (
    <>
      {data ? (
        data.status ? (
          data.data.map((book, index) => (
            <div
              key={index}
              className="book-tile"
              style={{ backgroundImage: `url(${book.cover_img}` }}
            >
              <a href={"/book/" + book.ibn}>
                <div className="book-details">
                  <div className="book-overview">
                    <p className="book-name">
                      <h2>{book.title}</h2>
                      <b>{book.author}</b>
                    </p>

                    <p className="book-rating">
                      <h2>{book.avg_rating}</h2>
                      <b>({book.reviews.length})</b>
                    </p>
                  </div>
                  <p className="book-description">
                    <b>Description :</b> <br />
                    {book.description}
                  </p>
                </div>
              </a>
            </div>
          ))
        ) : (
          "No books"
        )
      ) : (
        <>
         <h1>Please wait</h1>
        </>
      )}
    </>
  );
}

export default LandingPage;