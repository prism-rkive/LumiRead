import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import checkAuth from "../../service/auth";
import BookDetails from "./pages/book";
import LandingPage from "./pages/landing";
import Addbook from "./pages/addBook";
import SearchPage from "./pages/search";
import GenrePage from "./pages/genre";

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth().then((res) => {
      setSignedIn(res.signedIn);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return signedIn ? (
    children
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

function MainComponent() {
  return (
    <div className="Main">
      <Router>
        <Routes>
          <Route
            path="/addbook"
            element={
              <PrivateRoute>
                <Addbook />
              </PrivateRoute>
            }
          />
          <Route path="/book/:isbn" element={<BookDetails />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/genre/:genre" element={<GenrePage />} />
          <Route path="*" element={<h1>404 :[</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default MainComponent;