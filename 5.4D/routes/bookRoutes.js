const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

//GET all books
router.get('/', bookController.getAllBooks);

//GET a single book by ID
router.get('/:id', bookController.getBookById);

//POST /api/books - Create a new book
router.post('/', bookController.createBook);

//PUT /api/books/:id - Update an existing book
router.put('/:id', bookController.updateBook);

module.exports = router;