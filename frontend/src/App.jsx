import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Filter from "./components/main/filter";
import Header from "./components/main/header";
import UserComponent from "./components/user";
import AddBookPage from "./components/main/pages/addBook/index"; // Add /index
import SearchPage from "./components/main/pages/search/index";
import BookDetails from "./components/main/pages/book/index";

// Protected Route - only accessible if logged in
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  return user ? children : <Navigate to="/" />;
};

// Public Route - redirects to /addbook if already logged in
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('currentUser');
  return user ? <Navigate to="/addbook" /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Login/Register page */}
          <Route path="/" element={
            <PublicRoute>
              <UserComponent />
            </PublicRoute>
          } />

          {/* Add Book page */}
          <Route path="/addbook" element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          } />

          {/* Search page */}
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          } />

          {/* Book Details page */}
          <Route path="/book/:ibn" element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;