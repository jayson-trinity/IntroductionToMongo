const express = require('express')
const mongoose = require('mongoose');
const dbUtil = require("./lib/dbUtil_Books")
const dbUtil_Users = require ("./lib/dbUtil_Users") 
const helper = require("./lib/helper")

const app = express()
const port = 3000

let count = 0

// Connect to MongoDB
async function connectToMongoDB() {
  await mongoose.connect('mongodb://127.0.0.1:27017/book-store');
  console.log("::::::::Connected to MongoDB server:::::::::")
}
connectToMongoDB()


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res) => {
  count++
  res.send(`There has been ${count} request since the server started`)
})

//gets all books
app.get('/books', async (req, res) => {
  try {
    const data = await dbUtil.getAllBooks()
    res.status(200).send({ message: 'Books retrieved', data: data })
  } catch (error) {
    res.status(404).send({ err: error, message: 'Could not retrieve books' })
  }
})

//gets a particular book by id
app.get('/books/:book_id', async (req, res) => {
  const book_id = req.params.book_id
  try {
    const data = await dbUtil.getOneBook(book_id)
    res.status(200).send({ message: 'Book retrieved', data: data })
  } catch (error) {
    res.status(404).send({ err: error, message: 'Could not retrieve book' })
  }
})

//adds a book to the database or creates a book
app.post("/books", async (req, res) => {
  const data = req.body

  try {
    await dbUtil.createBook(data)
    res.status(200).send({ message: "book added successfully", data: null })
  } catch (error) {
    res.status(400).send({ message: "could not add book" })
  }
})

//modifies a particular book
app.patch("/books/:book_id", async (req, res) => {
  const data = req.body
  const book_id = req.params.book_id

  try {
    await dbUtil.updateBook(book_id, data)
    res.status(200).send({ message: 'Book updated successfully' })
  } catch (error) {
    res.status(404).send({ err: error, data: null, message: 'Could not update book' })
  }
})

// rents book
app.put("/books/:book_id", async (req, res) => {
  const data = req.body
  const book_id = req.params.book_id
 
  
  try {
    
    if (data.copies < 1) {
      res.status(200).send({message: 'Book is out of stock'});
    }else {
      data.copies-1;
      await dbUtil.rentBook(book_id, data);
      res.status(200).send({ message: 'Book rented successfully' })
    }
  } catch (error) {
    res.status(404).send({ err: error, data: null, message: 'Could not rent book' })
  }
})

//deletes a book from the database
app.delete("/books/:book_id", async (req, res) => {
  const book_id = req.params.book_id

  try {
    await dbUtil.deleteBook(book_id)
    res.status(200).send({ message: 'Book deleted successfully' })
  } catch (error) {
    res.status(400).send({ err: error, message: 'Could not delete book' })
  }
})


//gets all users
app.get('/users', async (req, res) => {
  try {
    const data = await dbUtil_Users.getAllUsers()
    res.status(200).send({ message: 'Users retrieved', data: data })
  } catch (error) {
    res.status(404).send({ err: error, message: 'Could not retrieve Users' })
  }
})

//gets a particular user by id
app.get('/users/:user_id', async (req, res) => {
  const user_id = req.params.user_id
  try {
    const data = await dbUtil_Users.getOneUser(user_id)
    res.status(200).send({ message: 'User retrieved', data: data })
  } catch (error) {
    res.status(404).send({ err: error, message: 'Could not retrieve user' })
  }
})

//adds a user to the database or creates a book
app.post("/users", async (req, res) => {
  const data = req.body

  try {
    await dbUtil_Users.createUser(data)
    res.status(200).send({ message: "user added successfully", data: null })
  } catch (error) {
    res.status(400).send({ message: "could add user" })
  }
})

//modifies a particular book
app.patch("/users/:user_id", async (req, res) => {
  const data = req.body
  const user_id = req.params.user_id

  try {
    await dbUtil_Users.updateUser(user_id, data)
    res.status(200).send({ message: 'user updated successfully' })
  } catch (error) {
    res.status(404).send({ err: error, data: null, message: 'Could not update user' })
  }
})


//deletes a userfrom the database
app.delete("/users/:user_id", async (req, res) => {
  const user_id = req.params.user_id

  try {
    await dbUtil_Users.deleteUser(user_id)
    res.status(200).send({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(400).send({ err: error, message: 'Could not delete User' })
  }
})


app.use('**', (req, res) => {
  res.status(404).send("Route not found")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



module.exports = {
  app
}