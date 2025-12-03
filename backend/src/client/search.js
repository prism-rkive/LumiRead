const books = require('../models/books');

const searchBooks = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.json({ status: false, message: "Query is required" });
        }

        // Case-insensitive search using regex
        const searchResults = await books.find({
            title: { $regex: query, $options: 'i' }
        });

        return res.json({ status: true, data: searchResults });
    } catch (e) {
        return res.json({ status: false, error: e.message });
    }
};

module.exports = searchBooks;
