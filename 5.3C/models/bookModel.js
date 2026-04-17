const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    summary: { type: String, required: true },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        //converting the Decimal128 to a readable string
        get: (v) => v.toString()
    }
}, {
    //to ensure the getter runs when we send data as JSON
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = mongoose.model('Book', bookSchema);