const mongoose= require('mongoose');
Schema= mongoose.Schema;

var CharacterSchema = new Schema({
    name: String
});

const BookSchema= new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    image: String,
    release_date: String,
    characters: [CharacterSchema]
});



const Book = mongoose.model('Book', BookSchema);
const Character= mongoose.model('Character',CharacterSchema);

module.exports = Book;