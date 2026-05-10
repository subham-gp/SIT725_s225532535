const mongoose = require('mongoose');
const Book = require('./models/bookModel');

//Connection Logic
mongoose.connect('mongodb://127.0.0.1:27017/Books')
    .then(() => {
        console.log("Ready to seed database...");
        seedDB();
    })
    .catch(err => console.error("Connection error:", err));

const bookData = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Classic",
        summary: "A story of wealth, love, and the American Dream in the 1920s.",
        price: "29.99"
    },
    {
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian",
        summary: "A chilling portrayal of a totalitarian future.",
        price: "22.00"
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
        genre: "Classic",
        summary: "Elizabeth Bennet and Mr. Darcy navigate social expectations.",
        price: "22.00"
    },
    {
        title: "The English Patient",
        author: "Michael Ondaatje",
        year: 1992,
        genre: "Historical Fiction",
        summary: "Four strangers in a ruined villa confront memory and loss.",
        price: "25.39"
    },
    {
        title: "Small Gods",
        author: "Terry Pratchett",
        year: 1992,
        genre: "Fantasy",
        summary: "A god returns as a tortoise, and a novice must confront dogma.",
        price: "31.99"
    }
];

const seedDB = async () => {
    try {
        //Clear existing data to avoid duplicates
        await Book.deleteMany({});
        //Insert new data
        await Book.insertMany(bookData);
        console.log("Database Seeded successfully with 5 books!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};