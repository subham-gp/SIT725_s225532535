const bookService = require('../services/bookService');

//Controller to handle fetching all books
const getAllBooks = (req, res) => {
    try {
        const books = bookService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            data: books,
            message: "Books retrieved successfully"
        });
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

//Controller to handle fetching a single book by ID
const getBookById = (req, res) => {
    try {
        const bookId = req.params.id; // Extract ID from the URL
        const book = bookService.getBookById(bookId);

        if (book) {
            res.status(200).json({
                statusCode: 200,
                data: book,
                message: "Book found"
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                message: "Book not found"
            });
        }
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById
};