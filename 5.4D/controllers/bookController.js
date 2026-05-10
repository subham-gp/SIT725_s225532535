const bookService = require('../services/bookService');

//GET all books
const getAllBooks = async (req, res) => {
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            data: books,
            message: "Success",
            developedBy: "Subham Gupta - s225532535"    //ID Marker
        });
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};

//GET single book by ID
const getBookById = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        if (book) {
            res.status(200).json({ statusCode: 200, data: book });
        } else {
            res.status(404).json({ statusCode: 404, message: "Book not found" });
        }
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
    }
};

//POST - Create a new book
const createBook = async (req, res) => {
    try {
        const newBook = await bookService.createBook(req.body);
        res.status(201).json({ statusCode: 201, data: newBook, message: "Created" });
    } catch (err) {
        //Handle Duplicate ID
        if (err.name === 'ConflictError' || err.code === 11000) {
            return res.status(409).json({ statusCode: 409, message: "Conflict: Duplicate ID" });
        }
        //Handle Validation Failures
        if (err.name === 'ValidationError') {
            return res.status(400).json({ statusCode: 400, message: err.message });
        }
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

//Update a book
const updateBook = async (req, res) => {
    try {
        const updatedBook = await bookService.updateBook(req.params.id, req.body);
        if (!updatedBook) {
            return res.status(404).json({ statusCode: 404, message: "Not Found" });
        }
        res.status(200).json({ statusCode: 200, data: updatedBook, message: "Updated" });
    } catch (err) {
        //Handle Immutability or Validation Failures
        if (err.name === 'ValidationError' || err.message.includes('immutable')) {
            return res.status(400).json({ statusCode: 400, message: err.message });
        }
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook
};