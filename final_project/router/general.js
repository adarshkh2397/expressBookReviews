const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

//Promise Callback to get the list of books
const getListOfBooks = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject({ message: "No books found" });
    }
  });
};

// Get the book list available in the shop
public_users.get("/", (req, res) => {
  getListOfBooks()
    .then((books) => {
      return res.status(200).json(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

//Promise Callback to get book details by ISBN
const getBookDetailsByISBN = (req) => {
  return new Promise((resolve, reject) => {
    let reqISBN = req.params.isbn;
    if (books[reqISBN]) {
      resolve(books[reqISBN]);
    } else {
      reject({ message: "No book found for requested isbn" });
    }
  });
};

// Get book details based on ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  getBookDetailsByISBN(req)
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

//Promise Callback to get book details by author name
const getBooksDetailsByAuthor = (req) => {
  return new Promise((resolve, reject) => {
    let booksByAuthor = [];
    let author = req.params.author;
    keyList = Object.keys(books);
    keyList.forEach(function (key) {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    });
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ message: "No book found for requested author" });
    }
  });
};

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  getBooksDetailsByAuthor(req)
    .then((books) => {
      res.status(200).send(books);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

//Promise Callback to get book details by book title
const getBooksDetailsByTitle = (req) => {
  return new Promise((resolve, reject) => {
    let booksByTitle = [];
    let title = req.params.title;
    keyList = Object.keys(books);
    keyList.forEach(function (key) {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    });
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ message: "No book found for requested author" });
    }
  });
};

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  getBooksDetailsByTitle(req)
    .then((books) => {
      res.status(200).send(books);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  let reqISBN = req.params.isbn;
  if (books[reqISBN]) {
    res.status(200).send(books[reqISBN].reviews);
  } else {
    res.status(404).json({ message: "No book found for requested isbn" });
  }
});

module.exports.general = public_users;
