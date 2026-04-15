//In-memory array to store book data
const books = [
    {
        id: "b1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Classic",
        summary: "A story of wealth, love, and the American Dream in the 1920s."
    },
    {
        id: "b2",
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian",
        summary: "A chilling portrayal of a totalitarian future and the struggle for individual freedom."
    },
    {
        id: "b3",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
        genre: "Classic",
        summary: "Elizabeth Bennet and Mr. Darcy navigate pride and social expectations."
    },
    {
        id: "b4",
        title: "The English Patient",
        author: "Michael Ondaatje",
        year: 1992,
        genre: "Historical Fiction",
        summary: "Four strangers in a ruined Italian villa confront memory and loss at the end of WWII."
    },
    {
        id: "b5",
        title: "Small Gods",
        author: "Terry Pratchett",
        year: 1992,
        genre: "Fantasy",
        summary: "In Omnia, the god Om returns as a tortoise, and a novice must confront dogma."
    }
];

//Logic to get all books
const getAllBooks = () => {
    return books;
};

//Logic to get a specific book by ID
const getBookById = (id) => {
    return books.find(book => book.id === id);
};

module.exports = {
    getAllBooks,
    getBookById
};