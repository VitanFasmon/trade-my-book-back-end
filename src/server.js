const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = require("./db");
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const authenticateToken = require("./middleware/auth");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to TradeMyBook API");
});

// Public routes
app.post("/api/register", userController.register);
app.post("/api/login", userController.login);

// Protected routes
app.post("/api/books", authenticateToken, bookController.addBook);
app.get(
  "/api/books/location/:location_id",
  authenticateToken,
  bookController.getBooksByLocation
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
