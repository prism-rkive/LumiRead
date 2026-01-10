import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLibraryBooks } from "../../../services/api";
import { Library, Search, AlertCircle, BookOpen } from "lucide-react";
import Sidebar from "../../Sidebar";
import "./BookshelfPage.css"; // Reuse existing styles for consistency

const LibraryPage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAllBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllLibraryBooks();
            if (data.status) {
                setBooks(data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load global library");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bookshelf-page">
            <Sidebar />

            <div className="bookshelf-content">
                <div className="bookshelf-container">
                    {/* Header Section */}
                    <div className="bookshelf-header">
                        <h1>
                            Global <span className="highlight">Library</span>
                        </h1>
                        <p className="subtitle">
                            Explore all books available in BiblioHub — added by our community.
                        </p>
                    </div>

                    <div className="search-card" style={{ marginBottom: '2rem' }}>
                        <div className="search-input-wrapper" style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Filter by title or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{ width: '100%', paddingRight: '45px' }}
                            />
                            <div className="search-icon-inside" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                <Search size={20} />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="error-alert">
                            <AlertCircle size={20} />
                            <p>{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner" style={{ margin: '0 auto 1rem' }} />
                            <p className="text-gray-500">Loading library...</p>
                        </div>
                    ) : (
                        <div className="collection-section">
                            <div className="collection-header">
                                <Library size={24} />
                                <h2>All Books</h2>
                                <span className="book-count">{filteredBooks.length} books</span>
                            </div>

                            {filteredBooks.length === 0 ? (
                                <div className="empty-state">
                                    <BookOpen size={48} />
                                    <p>{searchQuery ? "No books match your filter" : "The library is currently empty"}</p>
                                </div>
                            ) : (
                                <div className="bookshelf-grid">
                                    {filteredBooks.map((book) => (
                                        <div key={book._id} className="book-card" onClick={() => navigate(`/book/${book.ibn}`)} style={{ cursor: 'pointer' }}>
                                            <div className="book-card-inner">
                                                <img
                                                    src={book.cover_img || "/default-cover.png"}
                                                    alt={book.title}
                                                    className="book-cover"
                                                />
                                            </div>
                                            <div className="book-info">
                                                <h3 className="book-title">{book.title}</h3>
                                                <p className="book-author">{book.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LibraryPage;
