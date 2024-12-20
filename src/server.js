// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/../.env` });
const imageRoutes = require("./routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = require("./db");
const userController = require("./controllers/userController");
const bookController = require("./controllers/bookController");
const locationController = require("./controllers/locationController");
const tradeController = require("./controllers/tradeController");
const ratingController = require("./controllers/ratingController");

const authenticateToken = require("./middleware/auth");
const commentController = require("./controllers/commentController");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to TradeMyBook API");
});

// Public routes
app.post("/api/register", userController.register);
app.post("/api/login", userController.login);
app.get("/api/confirm/:token", userController.confirmEmail);
app.post("/api/resend-email", userController.resendConfirmationEmail);

// Public or optional-auth book search route
app.get("/api/books/search", authenticateToken, bookController.searchBooks);

// Protected book routes
app.post("/api/books", authenticateToken, bookController.addBook);
app.get(
  "/api/books/location/:location_id",
  authenticateToken,
  bookController.getBooksByLocation
);
app.get("/api/books/user", authenticateToken, bookController.getBooksByUser);
app.get("/api/books/:book_id", authenticateToken, bookController.findBookById);
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
app.patch(
  "/api/books/:book_id",
  authenticateToken,
  bookController.updateBookById
);
// Protected user routes
app.get("/api/user", authenticateToken, userController.getUserData);
app.get(
  "/api/user/email/:email",
  authenticateToken,
  userController.getUserDataByEmail
);
app.get("/api/user/id/:id", authenticateToken, userController.getUserDataById);
app.get(
  "/api/user/trades/accepted/:id",
  authenticateToken,
  userController.getAcceptedTradesIdsByUserId
);
app.patch(
  "/api/user/location",
  authenticateToken,
  userController.updateUserLocationById
);
app.patch("/api/user/name", authenticateToken, userController.updateUserName);
app.patch(
  "/api/user/phone",
  authenticateToken,
  userController.updateUserPhoneNumber
);

// Location routes
app.post("/api/location", locationController.addLocation);
app.get("/api/location/:id", locationController.findLocationById);
app.get("/api/location", locationController.findLocationByAddress);

// Trade routes
app.post("/api/trades", authenticateToken, tradeController.createTrade);
app.get(
  "/api/trade/:trade_id",
  authenticateToken,
  tradeController.getTradeById
);
app.get("/api/trade/public/:trade_id", tradeController.getPublicTradeById);
app.get("/api/trades/user", authenticateToken, tradeController.getTradesByUser);
app.patch(
  "/api/trades/:trade_id/status",
  authenticateToken,
  tradeController.updateTradeStatus
);

//Rating routes
app.post("/api/ratings", ratingController.createRating);
app.patch("/api/ratings", ratingController.updateRating);
app.get("/api/ratings/user/:user_id", ratingController.getRatingsByUserId);

app.get("/api/ratings/trade/:trade_id", ratingController.getRatingsByTradeId);

app.get(
  "/api/ratings/user/:user_id/average",
  ratingController.getAverageRatingByUserId
);

//Comment routes
app.get("/api/comments/:trade_id", commentController.getCommentsByTradeId);
app.get("/api/comment/:comment_id", commentController.getCommentsByTradeId);
app.post("/api/comments", authenticateToken, commentController.addComment);

//Image routes
app.use("/api/image", imageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
