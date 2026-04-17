const Book = require('../models/bookModel');

//Fetching all books from MongoDB
const getAllBooks = async () => {
    // .find({}) gets everything in the collection
    return await Book.find({});
};

//Fetching a specific book by its MongoDB _id
const getBookById = async (id) => {
    // .findById(id) looks for the unique MongoDB ID
    return await Book.findById(id);
};

module.exports = {
    getAllBooks,
    getBookById
};