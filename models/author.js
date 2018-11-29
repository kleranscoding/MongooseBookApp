const mongoose= require('mongoose');

const AuthorSchema = new mongoose.Schema({
    name: String,
    alive: Boolean,
    image: String
});

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;