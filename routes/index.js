var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require('../models').Book;


//For Search Function
const Sequelize = require('sequelize');
const db = require('../models');
const { Op } = db.Sequelize;


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

// Shows the full list of books and Pagination for books
router.get('/books', asyncHandler(async (req, res) => {
//  let numOfPages = Math.ceil( numOfBooks /  )
//  let numOfBooks = limit;
 
  // const books = await Book.findAndCountAll({
  //   order: [["createdAt", "ASC"]],
  //   // limit:,
  //   // offset: 
  // });
  // console.log(books)
 

  const books = await Book.findAll({ 
    order: [["createdAt", "ASC"]],
  });

  if (books) {
    return res.render('index', {books, title: "Books"});
  } else {
    res.sendStatus(404);
  }
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', {book: {}, title: "New Book"});      //is the book id messssed up when submitting new books
}));

// Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/");
    console.log('Posting a new book to the database');
  } catch (error) {
    if(error.name === "SequelizeValidationError") { 
      //shows error for when there is no author or title
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }
  }
  
}));

// Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book, title: "Update Book"});
  } else {
      const err = new Error("Oops, this isn't the page you are looking for!");
      err.status = 404;
      err.message = "Oh No! Why don't you try a different page!";
      res.render('page-not-found', {err})
      next(err);
  } 
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
}));

// Deletes a book--BE CAREFUL
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

//Search Bar Request
router.post('/search', asyncHandler(async (req, res) => {
  var { search } = req.body;

  try {
  const books = await Book.findAll({ 
      where: { 
        [Op.or]:[
          {title: {
            [Op.like]: `%${search}%`
          }},
          {author:{
            [Op.like]: `%${search}%`
          }},
          {genre: {
            [Op.like]: `%${search}%`
          }},
          {year: {
            [Op.like]: `${search}`
          }}
      ] } 
     });
      res.render('index', { books } )
      console.log('search working!');
    } catch {
      res.render('page-not-found');
      console.log('search not working!')
    }
}));


// Error Handling

// // 404 error
router.use((req, res, next) => {
  const err = new Error("Oops, this isn't the page you are looking for!");
  err.status = 404;
  err.message = "Oh No! Why don't you try a different page!";
  res.render('page-not-found', {err})
  next(err);
});

// // Global Error
router.use((err, req, res) => {
  err.status = 500;
  err.message = 'Looks iLike there was a server error, come back in a bit!';
  console.log(err.status, err.message, 'Handling a global error.');
  res.render('error', {error})
});

module.exports = router;
