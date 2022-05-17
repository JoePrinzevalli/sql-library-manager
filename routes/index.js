var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require('../models').Book;

/* async handler function for each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
};

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('/books');
});

// Shows the full list of books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  console.log(books)
  if (books) {
    res.render('index', {books, title: "Books"});
  } else {
    res.sendStatus(404);
  }
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', {book: {}, title: "New Book"});
}));

// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books/" + book.id);
  console.log('Posting a new book to the database');
}));

// Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('update-book')
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  const books = await Book.findByPK(req.params.id);
  res.render('update-book', {books, title: books.title})
}));

// Deletes a book--BE CAREFUL
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  if (condition) {
    res.render('');
  } else {
    res.sendStatus(404);
  }
}));


// Error Handling

// 404 error
router.use((req, res, next) => {
  const err = new Error("Oops, this isn't the page you are looking for!");
  err.status = 404;
  err.message = "Oh No! Why don't you try a different page!";
  res.render('page-not-found', {err})
  next(err);
});

// Global Error
router.use((err, req, res) => {
  err.status = 500;
  err.message = 'Looks like there was a server error, come back in a bit!';
  console.log(err.status, err.message, 'Handling a global error.');
  res.render('error', {error})
});

module.exports = router;
