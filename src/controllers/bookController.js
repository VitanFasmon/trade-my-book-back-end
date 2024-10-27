const Book = require("../models/Book");

const bookController = {
  addBook: async (req, res) => {
    // Extract user ID from the JWT token
    const userId = req.user.user_id; // Assuming req.user is populated by your authentication middleware

    // Destructure the required fields from req.body
    const {
      title,
      author,
      description,
      isbn,
      google_books_id,
      cover_url,
      book_condition, // Ensure this is an integer between 1 and 10
    } = req.body;

    try {
      // Call the addBook method with the new parameters
      const book = await Book.addBook(
        title,
        author,
        description,
        isbn,
        google_books_id,
        userId, // Use the extracted user ID
        cover_url,
        book_condition
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
