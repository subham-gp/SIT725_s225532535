var express = require("express")
const path = require('path');
var app = express()
var port = process.env.port || 3001;

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory array to store quotes
let quotes = [
    "The best way to predict the future is to invent it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Do not wait to strike till the iron is hot; but make it hot by striking."
];

// GET endpoint to retrieve a random quote
// Usage example: http://localhost:3000/api/quote
app.get('/api/quote', (req, res) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json({ quote: quotes[randomIndex] });
});

// Optional: POST endpoint to add a new quote
// Example POST body: { "quote": "Your new inspirational quote." }
app.post('/api/quote', (req, res) => {
    const { quote } = req.body;
    if (!quote || typeof quote !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid quote.' });
    }
    quotes.push(quote);
    res.json({ message: 'Quote added successfully.', quotes });
});

// Additional example endpoint to check server health
app.get('/health', (req, res) => {
    res.send('Server is healthy!');
});

// GET endpoint to add two numbers using query parameters
// Example: http://localhost:3000/add?a=10&b=15
app.get('/add', (req, res) => {
    // Parse the numbers from the query string
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);

    // Validate the inputs
    if (isNaN(a) || isNaN(b)) {
        return res.send("Error: Please provide two valid numbers using query parameters 'a' and 'b'.");
    }

    // Calculate the sum
    const sum = a + b;

    // Send the result as plain text
    res.send(`The sum of ${a} and ${b} is: ${sum}`);
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});