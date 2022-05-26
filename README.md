SQL-Library-Manager

A web application that includes pages to list, add, update, and delete books.

-Make sure to use 'npm install' to install dependencies and either 'npm start' or 'nodemon' to start the application

This project can be viewed at 'http://localhost:3000/'.

Languages used:
-JavaScript
-Node.js
-Express
-Pug
-SQLite
-Sequelize
-CSS

Important Features:
-A filtering option has been added to let user search based on title, author, genre or year. Search is case insensitive and works for partial matches on strings.
-Main book list includes a pagination feature.
-Validation errors if 'title' or 'author' fields are empty or invalid. Employs Sequelize Model validation rather than HTML’s built in validation.
-Personal styled 404 and global error pages.