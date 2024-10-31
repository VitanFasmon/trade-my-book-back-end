const Book = require("../models/Book");

const bookController = {
  addBook: async (req, res) => {
    const userId = req.user.user_id;

    const {
      title,
      author,
      description,
      isbn,
      google_books_id,
      cover_url,
      book_condition,
    } = req.body;

    try {
      const book = await Book.addBook(
        title,
        author,
        description,
        isbn,
        google_books_id,
        userId,
        cover_url,
        book_condition
      );
      res.json({ data: book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add book" });
    }
  },

  getBooksByLocation: async (req, res) => {
    const { location_id } = req.params;
    try {
      const books = await Book.getBooksByLocation(location_id);
      res.json({ data: books });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  },

  getBooksByUser: async (req, res) => {
    const userId = req.user.user_id;
    try {
      const books = await Book.getBooksByUser(userId);
      res.json({ data: books });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  },
  removeBookById: async (req, res) => {
    const userId = req.user.user_id;
    const { book_id } = req.params;

    try {
      const book = await Book.findBookById(book_id);

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.added_by_user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this book" });
      }

      const deletedBook = await Book.removeBookById(book_id);
      res.json({ data: deletedBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete book" });
    }
  },
};

module.exports = bookController;
