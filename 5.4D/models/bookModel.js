const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    //We explicitly define 'id' as a String and make it unique
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [1000, 'Year must be after 1000'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        //Enum restricts input to these specific strings for consistency
        enum: {
            values: ['Classic', 'Dystopian', 'Historical Fiction', 'Fantasy', 'Other'],
            message: '{VALUE} is not a supported genre'
        }
    },
    summary: {
        type: String,
        required: [true, 'Summary is required'],
        minlength: [10, 'Summary is too short']
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: [true, 'Price is required'],
        //Custom validator to ensure price isn't negative
        validate: {
            validator: function (v) {
                return parseFloat(v.toString()) > 0;
            },
            message: props => `${props.value} is not a valid price! Price must be greater than 0.`
        },
        get: (v) => v.toString()
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true },
    //This prevents Mongoose from adding the '__v' version key
    versionKey: false
});

module.exports = mongoose.model('Book', bookSchema);