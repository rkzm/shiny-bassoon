var mongoose, bookmodel;
mongoose = require('mongoose');
Schema = mongoose.Schema;

bookmodel = new Schema({
    title: {
        type: String
    },
    genre: {
        type: String
    },
    author: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Book', bookmodel);