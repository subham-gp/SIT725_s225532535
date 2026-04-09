const express = require('express');
const app = express();
const port = 3000;

//this tells Express to serve static files from the 'public' folder
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index.html');
});

const carList = [
    {
        title: "Ford Mustang",
        image: "images/mustang.webp",
        link: "About Mustang",
        description: "The original pony car, known for its powerful performance and iconic design."
    },
    {
        title: "Chevrolet Camaro",
        image: "images/camaro.jpg",
        link: "About Camaro",
        description: "A fierce competitor with high-performance engines and sharp handling."
    },
    {
        title: "Pontiac GTO",
        image: "images/gto.png",
        link: "About GTO",
        description: "Often credited as the first true muscle car of the 1960s."
    }
];

// This is our GET REST endpoint
app.get('/api/cars', (req, res) => {
    res.json({ statusCode: 200, data: carList, message: "Success" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});