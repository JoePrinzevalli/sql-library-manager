var express = require('express');
const app = require('../app');
var router = express.Router();
const Book = require('../models').Book;


// For google image search api

// function fetchData(url) {           
//   return fetch('https://www.google.com/jsapi')
//           .then(res => res.json())
//           .then(data => console.log(data))
//           .catch(err => console.log(err))
// }


//For Search Function
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
  //contains how many books will be shown per page
  const booksPerPage = 7;
   //retruns the page number from a query string
   let page = req.query.page ? Number(req.query.page) : 1;
  //sets the stating limit number
  const startingOffset = (page - 1) * booksPerPage;
  //contains all books in sql database
  const allBooks = await Book.findAll();
   //shows count of books and puts a limit to startingLimit
 const booksP = await Book.findAndCountAll({
  limit: booksPerPage,
  offset: startingOffset
});
  //returns number of buttons to be shwon index pug file---how to do this
  const numOfButtons = Math.ceil(booksP.count / booksPerPage);

  //helps deal with page errors---I think
  if (page > numOfButtons) {
    res.redirect('/books?page='+encodeURIComponent(numOfButtons) )
  } else if(page < 1){
    res.redirect('/books?page='+encodeURIComponent('1') )
  }

console.log(booksP.rows)

//will render books and pagination
if(booksP) {
  return res.render('index', {booksP: booksP.rows, title: "Books", page });
} 
  //code below wil be deleted later, just a replacment for now
  // const books = await Book.findAll({ 
  //   order: [["createdAt", "ASC"]],
  // });
  // if (books) {
  //   return res.render('index', {books, title: "Books"});
  // } else {
  //   res.sendStatus(404);
  // }
  //end of replacemnt code
}));

// Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', {book: {}, title: "New Book"});      
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
