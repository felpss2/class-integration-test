const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let books = [];
let loans = [];

// Rotas para livros
app.post("/books", (req, res) => {
  const { id, title, author } = req.body;
  if (!id || !title || !author) {
    return res.status(400).json({ error: "Invalid data" });
  }
  books.push({ id, title, author, available: true });
  res.status(201).json({ message: "Book added successfully" });
});

app.get("/books", (req, res) => {
  res.status(200).json(books);
});

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  if (title) book.title = title;
  if (author) book.author = author;

  res.status(200).json({ message: "Book updated successfully" });
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  books = books.filter((b) => b.id !== id);
  res.status(200).json({ message: "Book deleted successfully" });
});

// Rotas para empréstimos e devoluções
app.post("/loans", (req, res) => {
  const { id } = req.body;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  if (!book.available) {
    return res.status(400).json({ error: "Book not available" });
  }
  book.available = false;
  loans.push({ id, date: new Date() });
  res.status(201).json({ message: "Loan registered successfully" });
});

app.post("/returns", (req, res) => {
  const { id } = req.body;
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  book.available = true;
  loans = loans.filter((loan) => loan.id !== id);
  res.status(200).json({ message: "Book returned successfully" });
});

module.exports = app;

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
