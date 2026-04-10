const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Connection to Local MongoDB
mongoose.connect('mongodb://localhost:27017/Cars');

mongoose.connection.on('connected', () => {
    console.log('✅ Connected to local MongoDB: Cars');
});

//Define the Schema and Model
const CarSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});
const Car = mongoose.model('Car', CarSchema);

//GET Route - Fetching cars from the Database
app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find({
            title: { $in: ["Ford Mustang", "Chevrolet Camaro", "Pontiac GTO"] }
        });
        res.json({ statusCode: 200, data: cars, message: 'Success' });
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
});

//POST Route - Safe Write for Inquiry Form
app.post('/api/car', async (req, res) => {
    try {
        const { title, image, link, description } = req.body;
        const newCarInquiry = new Car({ title, image, link, description });

        await newCarInquiry.save();
        res.status(201).json({ statusCode: 201, data: newCarInquiry, message: 'Inquiry Saved' });
    } catch (err) {
        res.status(400).json({ statusCode: 400, message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});