import React from "react";
import "./style.css";

function Filter() {
  return (
    <>
      <div className="Filter">
        <div className="Filter-genre">
          Genre : <br/>
          <a href="/">
            <button className="input-button">all</button>
          </a>
          <br />
          <a href="/genre/romance">
            <button className="input-button">romance</button>
          </a>
          <a href="/genre/action">
            <button className="input-button">action</button>
          </a>
          <a href="/genre/fiction">
            <button className="input-button">fiction</button>
          </a>
          <a href="/genre/adventure">
            <button className="input-button">adventure</button>
          </a>
          <a href="/genre/mystery">
            <button className="input-button">mystery</button>
          </a>
          <a href="/genre/Meditation">
            <button className="input-button">meditation</button>
          </a>
          <a href="/genre/Self-Help">
            <button className="input-button">self help</button>
          </a>
        </div>

        {/* <div className="Filter-genre">
          Language :
          <br />
          <button></button>
        </div>
        <div className="Filter-genre">
          Author :
          <br />
          <button></button>
        </div> */}
      </div>
    </>
  );
}

export default Filter;