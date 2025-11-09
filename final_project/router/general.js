const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => {
      resolve(books);
    });
    return res.status(200).json(allBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Failed to fetch book list." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const book = await new Promise((resolve, reject) => {
      const foundBook = books[isbn];
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject('Book not found');
      }
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const book = await new Promise((resolve, reject) => {
      const foundBook = Object.values(books).filter(b => b.author === author);
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject('Book not found');
      }
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const filteredBooks = await new Promise((resolve, reject) => {
      const foundBooks = Object.values(books).filter(book => book.title === title);
      if (foundBooks.length > 0) resolve(foundBooks);
      else reject("No books found with this title");
    });

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  const reviews = books[isbn]?.reviews
  return res.send(JSON.stringify(reviews))
});

module.exports.general = public_users;
