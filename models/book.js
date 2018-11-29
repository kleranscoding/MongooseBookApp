const mongoose= require('mongoose');
Schema= mongoose.Schema;

const BookSchema= new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
    },
    image: String,
    release_date: String
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;