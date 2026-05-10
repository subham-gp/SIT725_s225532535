const Book = require('../models/bookModel');

//Fetch all books
const getAllBooks = async () => {
    return await Book.find({});
};

//Fetch a specific book by its unique string ID
const getBookById = async (id) => {
    return await Book.findOne({ id: id });
};

//Create a new book with duplicate check
const createBook = async (bookData) => {
    //Check if ID already exists
    const existingBook = await Book.findOne({ id: bookData.id });
    if (existingBook) {
        const error = new Error('Duplicate ID');
        error.name = 'DuplicateError';
        throw error;
    }

    //Mongoose rejects unknown fields - strict: true - by default
    const newBook = new Book(bookData);
    return await newBook.save();
};

//Updating an existing book while enforcing immutability
const updateBook = async (id, updateData) => {
    //Checking if the user is trying to change the ID
    if (updateData.id && updateData.id !== id) {
        const error = new Error('ID cannot be changed');
        error.name = 'ValidationError';
        throw error;
    }

    //findOneAndUpdate with runValidators: true ensures our schema rules (min/max/enum) are applied during the update
    const updatedBook = await Book.findOneAndUpdate(
        { id: id },
        updateData,
        { new: true, runValidators: true, overwrite: false }
    );

    return updatedBook;
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook
};