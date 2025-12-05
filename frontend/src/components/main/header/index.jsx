import React, { useState } from "react";
import "./style.css";

function Header() {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="Header">
        <h1 style={{ color: "#fff" }}>QuickBooks</h1>
        <form className="search-form" action={"/search/" + query}>
          <input
            placeholder="search by name or ISBN"
            className="search-field"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </form>
      </div>
    </>
  );
}

export default Header;