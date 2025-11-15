import React, { useEffect, useState } from "react";
import api from "../../../../service/api";

function SearchPage({
  catch: {
    params: { query },
  },
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        const res = await api.post("/search", { query });
        if (res.data) {
          setData(res.data);
        }
      } catch (e) {
        setData({ status: false });
      }
    }
    getData();
  }, [query]);
  return (
    <>
      {data
        ? data.status
          ? data.data.map((book, index) => (
              <a href={"/book/" + book.ibn}>
                <div key={index} className="book-tile">
                  <img src={book.cover_img} />
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
                </div>
              </a>
            ))
          : "No books"
        : "please wait"}
    </>
  );
}

export default SearchPage;