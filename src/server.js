const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = require("./db");
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const locationController = require("./controllers/locationController");

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

// Protected book routes
app.post("/api/books", authenticateToken, bookController.addBook);
app.get(
  "/api/books/location/:location_id",
  authenticateToken,
  bookController.getBooksByLocation
);
app.get("/api/books/user", authenticateToken, bookController.getBooksByUser);
app.delete(
  "/api/books/:book_id",
  authenticateToken,
  bookController.removeBookById
);
app.patch(
  "/api/books/tradable/:book_id/:tradable",
  authenticateToken,
  bookController.toggleTradableBookById
);
// Protected user routes
app.get("/api/user", authenticateToken, userController.getUserData);
app.get(
  "/api/user/email/:email",
  authenticateToken,
  userController.getUserData
);

//Location routes
app.post("/api/location", locationController.addLocation);
app.get("/api/location/:id", locationController.findLocationById);
app.get("/api/location", locationController.findLocationByAddress);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
