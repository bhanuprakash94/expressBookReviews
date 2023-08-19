const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
   let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }};

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Customer Successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const review = req.body.review;
    const isbn = req.params.isbn;
    let username = req.session.authorization['username'];;
    if (username) { //Check is username exists
        let ISBN=req.params.isbn;
        books[ISBN].reviews[username]=review;
        res.send(`The review for the book with ISBN ${ISBN}  has been added/updated.`);
    }
    else{
        res.send("Unable to add Review!");
    }
  
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization['username'];;
    if (username) { //Check is username exists
        let ISBN=req.params.isbn;
        if(books[ISBN].reviews[username]){
           delete books[ISBN].reviews[username];
            res.send(`Reviews for the ISBN ${ISBN} posted by the user ${username} deleted  .`);
        }
    }
    else{
        res.send("Unable to deletd Review!");
    }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
