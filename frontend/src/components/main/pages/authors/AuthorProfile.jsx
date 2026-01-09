import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Star } from "lucide-react";
import Sidebar from "../../../Sidebar";

const AuthorProfile = () => {
    const { name } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState("");
    const [authorImage, setAuthorImage] = useState(null);

    useEffect(() => {
        const fetchAuthorData = async () => {
            setLoading(true);
            try {
                // Fetch books by author from Google Books API
                const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:"${name}"&maxResults=20`);

                if (res.data.items) {
                    const uniqueBooks = [];
                    const seenTitles = new Set();

                    for (const item of res.data.items) {
                        const title = item.volumeInfo.title.toLowerCase().trim();
                        // Also check if image exists to improve quality
                        if (!seenTitles.has(title) && item.volumeInfo.imageLinks) {
                            seenTitles.add(title);
                            uniqueBooks.push(item);
                        }
                    }
                    setBooks(uniqueBooks);

                    // Attempt to find a bio or image from the first result if "About the Author" exists in description
                    // Note: Google API doesn't standardly provide Author Bios. We will simulate checking.
                    // Assuming no direct bio, we leave it empty or show a placeholder.
                    // If we want to get an image, we can try to find an avatar api or just use a placeholder.

                    // For now, let's proceed with just listing books.
                }

                // Try to "search" for author bio via a generic search logic if possible? 
                // Since we can't scrape, we might just use a placeholder text if no standard API is available.
                // However, I will set a nice generic fallback.

                setBio(`Explore the literary works of ${decodeURIComponent(name)}. Known for their contribution to literature, dive into the collection of books available below.`);

                // Try Wikipedia for Image
                try {
                    const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
                    if (wikiRes.data) {
                        if (wikiRes.data.thumbnail && wikiRes.data.thumbnail.source) {
                            setAuthorImage(wikiRes.data.thumbnail.source);
                        }
                        if (wikiRes.data.extract) {
                            setBio(wikiRes.data.extract);
                        }
                    }
                } catch (wErr) {
                    console.log("Wiki fetch failed", wErr);
                }

            } catch (err) {
                console.error("Error fetching author data", err);
            } finally {
                setLoading(false);
            }
        };

        if (name) fetchAuthorData();
    }, [name]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Sidebar />
            <div className="pl-0 md:pl-20 px-4 py-8 max-w-7xl mx-auto">
                <Link to="/discover-authors" className="inline-flex items-center text-gray-500 hover:text-red-600 mb-8 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Authors
                </Link>

                {/* Author Header Profile */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-xl overflow-hidden flex-shrink-0">
                        {/* Placeholder for author image - Google API doesn't provide author photos easily */}
                        <img
                            src={authorImage || `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b91c1c`}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-serif">{decodeURIComponent(name)}</h1>
                                <span className="inline-block mt-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider rounded-full">
                                    Author
                                </span>
                            </div>
                        </div>
                        {/* Follow button removed */}
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">About the Author</h3>
                        <p>{bio}</p>
                    </div>
                </div>
                {/* Books Grid */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    Books by <span className="text-red-600 ml-2">{decodeURIComponent(name)}</span>
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="spinner border-t-red-600">Loading books...</div>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No books found for this author.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {books.map((book) => {
                            const info = book.volumeInfo;
                            const isbn = info.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier || info.industryIdentifiers?.[0]?.identifier || book.id;

                            return (
                                <Link
                                    to={`/book/${isbn}`}
                                    state={{ bookData: book }} // Pass data to avoid re-fetch if possible or help init
                                    key={book.id}
                                    className="block group"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-4px]">
                                        <div className="aspect-[2/3] bg-gray-200 w-full overflow-hidden relative">
                                            <img
                                                src={info.imageLinks?.thumbnail || "/default-cover.png"}
                                                alt={info.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-red-600 transition-colors">
                                                {info.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-gray-500">{info.publishedDate?.substring(0, 4)}</span>
                                                <div className="flex items-center text-yellow-500 text-xs font-bold">
                                                    {info.averageRating && (
                                                        <>
                                                            {info.averageRating} <Star size={10} fill="currentColor" className="ml-0.5" />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorProfile;
