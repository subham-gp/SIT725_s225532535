const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

//GET /api/books to the getAllBooks controller function
router.get('/', bookController.getAllBooks);

//GET /api/books/:id to the getBookById controller function
router.get('/:id', bookController.getBookById);

module.exports = router;