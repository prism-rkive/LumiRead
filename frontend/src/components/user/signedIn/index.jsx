import React from "react";
import "./style.css";

function SignedIn() {
  const userData = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="signed-in-container">
      <div className="signed-in-card">
        <div className="user-profile">
          <div className="user-avatar">
            {userData?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2>Welcome, {userData?.name || userData?.username}!</h2>
          <p className="user-email">@{userData?.username}</p>
        </div>

        <div className="user-actions">
          <a href="/addbook" className="action-button primary">
            <span>📚</span>
            Add Book
          </a>
          
          <button
            className="action-button secondary"
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.reload();
            }}
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignedIn;