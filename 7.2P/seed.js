const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Cars')
    .then(() => console.log("✅ Ready to seed..."))
    .catch(err => console.error("Connection error:", err));

const CarSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});
const Car = mongoose.model('Car', CarSchema);

const muscleCarData = [
    {
        title: "Ford Mustang",
        image: "images/mustang.webp",
        link: "About Mustang",
        description: "The original pony car, known for its powerful performance."
    },
    {
        title: "Chevrolet Camaro",
        image: "images/camaro.jpg",
        link: "About Camaro",
        description: "A fierce competitor with high-performance engines."
    },
    {
        title: "Pontiac GTO",
        image: "images/gto.png",
        link: "About GTO",
        description: "Often credited as the first true muscle car of the 1960s."
    }
];

const seedDB = async () => {
    try {
        await Car.deleteMany({}); // Clears collection to avoid duplicates
        await Car.insertMany(muscleCarData);
        console.log("✅ Database Seeded with Muscle Cars!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();