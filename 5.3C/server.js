const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const port = 3000;

// Middleware to serve static files from the 'public' folder
app.use(express.static('public'));
app.use(express.json());

//Connection to Local MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Books')
    .then(() => console.log('Connected to MongoDB: Books'))
    .catch(err => console.error('MongoDB Connection Error:', err));

//book routes at the /api/books prefix
app.use('/api/books', bookRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});