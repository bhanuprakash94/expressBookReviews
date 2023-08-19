const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

const connectToURL = (url,res)=>{
    const req = axios.get(url);
    req.then(resp => {
        res.send(resp.data);
    })
    .catch(err => {
        res.send('failed to get data');
    });
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully re. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books)
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let ISBN=req.params.isbn;
  let book=books[ISBN];

  res.send(book,null,4)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author=req.params.author; 
  let bookKeys = Object.keys(books);
  let filterdBooks=[];
  for (let index in bookKeys) {
     if(books[bookKeys[index]].author === author){
        filterdBooks.push(books[bookKeys[index]]);
     }
  }
  res.send({'booksByAuthor':filterdBooks},null,4);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title=req.params.title; 
  let bookKeys = Object.keys(books);
  let filterdBooks=[];
  for (let index in bookKeys) {
     if(books[bookKeys[index]].title === title){
       filterdBooks.push(books[bookKeys[index]]);
     }
  }
  res.send({'booksByTitle':filterdBooks},null,4);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let ISBN=req.params.isbn;
    let reviews=books[ISBN].reviews;
    res.send(reviews,null,4);
});


//  Get book details using async axios
public_users.get('/getbooks',function (req, res) {
    connectToURL('https://venkatabhan1-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/',res);
});


//  Get book details by ISBN using async axios

public_users.get('/getBookByISBN/:isbn',function (req, res) {
    let ISBN=req.params.isbn;
    connectToURL('https://venkatabhan1-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/'+ISBN,res);
});

//  Get book details by author using async axios

public_users.get('/getBookByAuthor/:author',function (req, res) {
    let author=req.params.author;
    connectToURL('https://venkatabhan1-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/'+author,res);
    
});

//  Get book details by title using async axios

public_users.get('/getBookByTitle/:title',function (req, res) {
    let title=req.params.title;
    connectToURL('https://venkatabhan1-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/'+title,res);
});

module.exports.general = public_users;
