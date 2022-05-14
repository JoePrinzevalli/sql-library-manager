var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require('../models').Book;

const http = require("http");
const host = 'localhost';
const port = 3000;

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
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('/books');
  const books = await Book.findAll();
  console.log(books);
  res.json().books
  const server = http.createServer();
  server.listen(port, host, () => {
    console.log(`Server is running on port 3000`);
  });
});

// Shows the full list of books
router.get('/books', asyncHandler(async (req, res) => {
  if (condition) {
    res.render('');
  } else {
    res.sendStatus(404);
  }
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  if (condition) {
    res.render('');
  } else {
    res.sendStatus(404);
  }
}));

// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  if (condition) {
    res.render('');
  } else {
    res.sendStatus(404);
  }
}));

// Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  if (condition) {
    res.render('');
  } else {
    res.sendStatus(404);
  }
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  if (condition) {
    res.render('');
  } else {
    res.sendStatus(404);
  }
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



module.exports = router;
