const Book = require("../models/Book");

const bookController = {
  addBook: async (req, res) => {
    const { user_id, google_books_api_id, condition, picture, trade_status } =
      req.body;
    try {
      const book = await Book.addBook(
        user_id,
        google_books_api_id,
        condition,
        picture,
        trade_status
      );
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add book" });
    }
  },

  getBooksByLocation: async (req, res) => {
    const { location_id } = req.params;
    try {
      const books = await Book.getBooksByLocation(location_id);
      res.json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  },
};

module.exports = bookController;
