const express = require('express');
const mongoose = require('mongoose');

const http = require('http');   //Require to bind express with socket.io
const { Server } = require('socket.io')

const app = express();
const port = 3000;

//Creating HTTP Server instance wrapping Express app
const server = http.createServer(app);
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

// 1. Pure Calculation Function (Isolated Logic for Step 4 of Task sheet)
function calculateFinalBuyingPrice(originalPrice, discountPercentage) {
    // Safety Gate / Guard Clause: Protect against negative parameters or text strings
    if (
        typeof originalPrice !== 'number' || originalPrice < 0 || isNaN(originalPrice) ||
        typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100 || isNaN(discountPercentage)
    ) {
        return 0;
    }

    // Calculate markdown savings value
    const discountAmount = originalPrice * (discountPercentage / 100);
    const finalPrice = originalPrice - discountAmount;

    // Return the rounded financial numeric format
    return parseFloat(finalPrice.toFixed(2));
}

// 2. New GET API Route to link frontend to our calculation function
app.get('/api/calculate-discount', (req, res) => {
    const price = parseFloat(req.query.price);
    const discount = parseFloat(req.query.discount);

    const calculatedPrice = calculateFinalBuyingPrice(price, discount);

    res.json({
        statusCode: 200,
        finalPrice: calculatedPrice,
        message: 'Calculation successfully compiled'
    });
});

// 3. Capture the active server listener instance
const server = app.listen(port, () => {
    console.log(`Muscle Car Server running on http://localhost:${port}`);
});

// 4. Clean Export Block for Mocha Framework Execution Testing
module.exports = { app, server, calculateFinalBuyingPrice };

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});