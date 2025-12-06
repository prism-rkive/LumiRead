// src/index.js - Updated for API fix
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // use this path if your main CSS is index.css
import reportWebVitals from "./reportWebVitals";

// Create root and render App
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: measure performance
reportWebVitals();
