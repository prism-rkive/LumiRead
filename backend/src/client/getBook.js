const books = require('../models/books');

const getBook = async (req, res) => {
    try {
        const { ibn } = req.body;
        if (!ibn) {
            return res.json({ status: false, message: "ISBN is required" });
        }

        const book = await books.findOne({ ibn: ibn });

        if (book) {
            return res.json({ status: true, data: book });
        } else {
            return res.json({ status: false, message: "Book not found" });
        }
    } catch (e) {
        return res.json({ status: false, error: e.message });
    }
};

module.exports = getBook;
