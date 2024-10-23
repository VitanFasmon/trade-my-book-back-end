const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const authenticateToken = require("./middleware/auth"); // Import the authentication middleware

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON data processing

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to TradeMyBook API");
});

// User registration route
app.post("/api/register", userController.register);

// User login route
app.post("/api/login", userController.login);

// Add book route (protected)
app.post("/api/books", authenticateToken, bookController.addBook);

// Search books by location route (protected)
app.get(
  "/api/books/location/:location_id",
  authenticateToken,
  bookController.getBooksByLocation
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const pool = require("./db");
