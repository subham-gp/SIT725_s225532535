const express = require('express');
const mongoose = require('mongoose');

const http = require('http');   //Require to bind express with socket.io
const { Server } = require('socket.io')

const app = express();
const port = 3000;

//Creating HTTP Server instance wrapping Express app
const server = http.createServer(app);
const io = new Server(server);

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Connection to Local MongoDB
mongoose.connect('mongodb://localhost:27017/Cars');

mongoose.connection.on('connected', () => {
    console.log('✅Connected to local MongoDB: Cars');
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

//Calculation Function
function calculateFinalBuyingPrice(originalPrice, discountPercentage) {
    //Safety Gate / Guard Clause: Protect against negative parameters or text strings
    if (
        typeof originalPrice !== 'number' || originalPrice < 0 || isNaN(originalPrice) ||
        typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100 || isNaN(discountPercentage)
    ) {
        return 0;
    }

    //Calculate markdown savings value
    const discountAmount = originalPrice * (discountPercentage / 100);
    const finalPrice = originalPrice - discountAmount;

    //Return the rounded financial numeric format
    return parseFloat(finalPrice.toFixed(2));
}

//New GET API Route to link frontend to our calculation function
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

//Socket.io Logic
const stockAlerts = [
    "Low Stock Alert: Only 1 Ford Mustang left in inventory!",
    "Price Drop Alert: Chevrolet Camaro markdown updated!",
    "Hot Offer: 0% financing available on Pontiac GTO entries this week!",
    "High Demand: 5 users are currently viewing the Mustang Fastback!"
];

io.on('connection', (socket) => {
    console.log('A classic car enthusiast connected to the live feed');

    //Send an immediate custom welcome alert to this specific user
    socket.emit('carAlert', "Welcome! Connected to the Live Muscle Car Inventory feed.");

    //Set up a loop to send randomized mock stock alerts every 5 seconds to all connected clients
    const alertInterval = setInterval(() => {
        const randomAlert = stockAlerts[Math.floor(Math.random() * stockAlerts.length)];
        socket.emit('carAlert', randomAlert);
    }, 5000);

    socket.on('disconnect', () => {
        console.log('An enthusiast disconnected from the feed');
        clearInterval(alertInterval); // Stop execution to clear memory overhead
    });
});

//Start listening via the wrapped HTTP server instance
server.listen(port, () => {
    console.log(`Muscle Car Server running on http://localhost:${port}`);
});

//Clean Export Block for Mocha Framework Execution Testing
module.exports = { app, server, calculateFinalBuyingPrice };

//server.listen(port, () => {
//    console.log(`Server running at http://localhost:${port}`);
//});