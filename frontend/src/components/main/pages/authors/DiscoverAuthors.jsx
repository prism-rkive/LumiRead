import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, ChevronRight } from "lucide-react";
import api from "../../../../service/api";
import Sidebar from "../../../Sidebar";

const DiscoverAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [trendingAuthors, setTrendingAuthors] = useState([]);

    useEffect(() => {
        // Curated list of trending/popular authors to ensure quality content
        const POPULAR_AUTHORS = [
            "Stephen King", "J.K. Rowling", "George R.R. Martin",
            "Agatha Christie", "Haruki Murakami", "Neil Gaiman",
            "Colleen Hoover", "Brandon Sanderson"
        ];

        const initialTrending = POPULAR_AUTHORS.map(name => ({ name, image: null }));
        setTrendingAuthors(initialTrending);

        // Fetch images for trending authors
        initialTrending.forEach(async (authObj) => {
            try {
                const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(authObj.name)}`);
                if (res.data?.thumbnail?.source) {
                    setTrendingAuthors(prev => prev.map(a =>
                        a.name === authObj.name ? { ...a, image: res.data.thumbnail.source } : a
                    ));
                }
            } catch (e) {
                // quiet fail
            }
        });
    }, []);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
                const token = currentUser.token;

                if (!token) return;

                // Fetch User's Bookshelf to get list of authors
                const { data } = await api.get("/api/bookshelf/mybooks", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data.status && data.data) {
                    // Extract unique authors
                    const authorSet = new Set();
                    const books = data.data;

                    books.forEach(book => {
                        if (book.author) {
                            authorSet.add(book.author);
                        }
                    });

                    const uniqueAuthors = Array.from(authorSet);

                    // Initial state with name and no image
                    const initialAuthors = uniqueAuthors.map(name => ({
                        name,
                        image: null
                    }));
                    setAuthors(initialAuthors);
                    setLoading(false);

                    // Fetch images asynchronously for each author
                    initialAuthors.forEach(async (authObj) => {
                        try {
                            const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(authObj.name)}`);
                            if (res.data?.thumbnail?.source) {
                                setAuthors(prev => prev.map(a =>
                                    a.name === authObj.name ? { ...a, image: res.data.thumbnail.source } : a
                                ));
                            }
                        } catch (e) {
                            // quiet fail
                        }
                    });
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error("Failed to load authors", err);
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Sidebar />
            <div className="pl-0 md:pl-20 px-4 py-8 max-w-7xl mx-auto">
                <div className="mb-10 text-center md:text-left pt-16 md:pt-0">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Discover Your <span className="text-red-600">Authors</span>
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Explore the writers behind your personal collection.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : authors.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No authors found</h3>
                        <p className="text-gray-500">Add books to your shelf to see authors here.</p>
                        <Link to="/search" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                            Find Books
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {authors.map((author, index) => (
                            <Link
                                to={`/author/${encodeURIComponent(author.name)}`}
                                key={index}
                                className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={author.image || `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}&backgroundColor=b91c1c`}
                                        alt={author.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 transition-colors">
                                    {author.name}
                                </h3>
                                <span className="text-sm text-gray-500 font-medium flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                                    View Profile <ChevronRight size={14} className="ml-1" />
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Trending Authors Section */}
                <div className="mt-16 mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Trending <span className="text-red-600">Authors</span>
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Popular writers you might want to check out.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
                    {trendingAuthors.map((author, index) => (
                        <Link
                            to={`/author/${encodeURIComponent(author.name)}`}
                            key={index + 1000}
                            className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-xl overflow-hidden flex-shrink-0">
                                <img
                                    src={author.image || `https://api.dicebear.com/7.x/initials/svg?seed=${author.name}&backgroundColor=b91c1c`}
                                    alt={author.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-red-600 transition-colors">
                                {author.name}
                            </h3>
                            <span className="text-sm text-gray-500 font-medium flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                                View Profile <ChevronRight size={14} className="ml-1" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscoverAuthors;
