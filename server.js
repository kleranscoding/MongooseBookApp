// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
const express = require('express'),
  bodyParser = require('body-parser');
  
// require db in our app
const db= require('./models');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));



////////////////////
//  DATA
///////////////////
/*
var books = [
  {
    _id: 15,
    title: 'The Four Hour Workweek',
    author: 'Tim Ferriss',
    image: 'https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg',
    release_date: 'April 1, 2007'
  },
  {
    _id: 16,
    title: 'Of Mice and Men',
    author: 'John Steinbeck',
    image: 'https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg',
    release_date: 'Unknown 1937'
  },
  {
    _id: 17,
    title: 'Romeo and Juliet',
    author: 'William Shakespeare',
    image: 'https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg',
    release_date: 'Unknown 1597'
  }
];
//*/

var newBookUUID = 18;
var portNum= 3000;







////////////////////
//  ROUTES
///////////////////


//***** ========== BOOKS related =========== *****//

// define a root route: localhost:3000/
app.get('/', (req, res)=> {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', (req, res)=> {
  db.Book.find().populate('author').exec((err, books)=>{
    if (err) { console.log('index error: '+err); res.sendStatus(500); }
    res.json(books);
  });
});
/*
app.get('/api/books', (req, res)=> {
  // send all books as JSON response
  db.Book.find((err, books)=> {
    if (err) { console.log('index error: '+err); res.sendStatus(500); }
    res.json(books);
  });
});
//*/


// get one book
app.get('/api/books/:id', (req, res)=> {
  // find one book by its id
  console.log('books show', req.params.id);
  db.Book.findById(req.params.id).populate('author').exec((err,books)=>{
    if (err) { 
      console.log('index error: '+err); res.sendStatus(500); 
    } else if (books==null) {
      res.sendStatus(404);
    } 
    res.json(books);
  });
});


// create new book
app.post('/api/books', (req, res)=> {
  var newBook = new db.Book({
    title: req.body.title,
    image: req.body.image,
    release_date: req.body.release_date,
  });
  db.Author.findOne({name: req.body.author},(err, author)=>{
    console.log(author);
    if (author==null) {
      author= new db.Author({ name: req.body.author, alive: false });
      author.save((err,newAuthor)=>{
        if (err) { console.log("create new author error: " + err); }
      });
    }
    newBook.author = author;
    // add newBook to database
    newBook.save((err, book)=> {
      if (err) { console.log("create error: " + err); }
      console.log("created ", book.title);
      res.json(book);
    });
  });
});
/*
app.post('/api/books', (req, res)=> {
  var newBook= req.body;
  console.log('books create', newBook);
  db.Book.create(newBook, (err,books)=>{
    if (err) { console.log('error: '+err); res.sendStatus(500); }
    res.json(books);
  });
});
//*/


// update book
app.put('/api/books/:id', (req, res)=> {
  var reqID= req.params.id;
  console.log('books update', reqID);
  db.Book.findOneAndUpdate({_id: reqID},req.body,{new: true},(err,books)=>{
    if (err) { console.log('error: '+err); res.sendStatus(500); }
    /*
    console.log(books.author);
    var author;
    db.Author.findById(books.author,(err,bookAuthor)=>{
      if (err) { console.log('error: '+err); res.sendStatus(500); }
      auhtor= bookAuthor;
    });
    //*/
    res.json(books);
  });
});


// delete book
app.delete('/api/books/:id', (req, res)=> {
  var reqID=req.params.id;
  console.log('books delete', reqID);
  db.Book.findByIdAndDelete(reqID,(err,books)=>{
    if (err) { console.log('error: '+err); res.sendStatus(500); }
    res.json(books);
  });
});


//***** ========== AUTHORS related =========== *****//

app.get('/api/authors', (req, res)=>{
  db.Author.find({},(err, authors)=>{
    if (err) { console.log('error: '+err); res.sendStatus(500); }
    res.json(authors);
  });
});



//***** ========== CHARACTERS related =========== *****//


app.post('/api/books/:book_id/characters', (req, res)=>{
  var bookId = req.params.book_id;
  db.Book.findById(bookId)
    .populate('author')
    .exec((err, foundBook)=> {
      // handle errors
      if (err) { 
        res.status(500).json({error: err.message}); 
      } else if (foundBook==null) { 
        res.status(404).json({error: "No Book found by this ID"});
      } else {
        // push req.body into characters array
        foundBook.characters.push(req.body);
        // save the book with the new character
        foundBook.save((err, books)=> {
          if (err) { console.log("create error: " + err); }
          // send the entire book back
          res.json(books);
        });
      }
    }
  );
});


app.get('/api/books/:book_id/characters', (req, res)=>{
  var bookId = req.params.book_id;
  db.Book.findById(bookId)
    .populate('author')
    .exec((err, foundBook)=> {
      // handle errors
      if (err) { 
        res.status(500).json({error: err.message}); 
      } else if (foundBook==null) { 
        res.status(404).json({error: "No Book found by this ID"});
      } else {
        // push req.body into characters array
        res.json(foundBook.characters);
      }
    }
  );
});





app.listen(process.env.PORT || portNum, ()=> {
  console.log(`Book app listening at http://localhost:${portNum}/`);
});
