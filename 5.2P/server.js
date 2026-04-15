const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const port = 3000;

// Middleware to serve static files from the 'public' folder
app.use(express.static('public'));
app.use(express.json());

//book routes at the /api/books prefix
app.use('/api/books', bookRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});