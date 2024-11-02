const Book = require("../models/Book");

const bookController = {
  addBook: async (req, res) => {
    const userId = req.user.user_id;

    const {
      title,
      subtitle,
      author,
      language,
      published_date,
      categories,
      description,
      isbn,
      google_books_id,
      cover_url,
      book_condition,
      tradable,
    } = req.body;

    try {
      const book = await Book.addBook(
        userId,
        title,
        subtitle,
        author,
        language,
        published_date,
        categories,
        description,
        isbn,
        google_books_id,
        cover_url,
        book_condition,
        tradable
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
  toggleTradableBookById: async (req, res) => {
    const userId = req.user.user_id;
    const { book_id, tradable } = req.params;

    try {
      const book = await Book.findBookById(book_id);

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.added_by_user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this book" });
      }

      const updatedBook = await Book.toggleTradableBookById(
        book_id,
        tradable == null ? false : tradable
      );
      res.json({
        data: updatedBook,
        message: "Book tradability updated successfully.",
      });
    } catch (error) {
      console.error("Error toggling book tradability:", error);
      res.status(500).json({ error: "Failed to update book" });
    }
  },
};

module.exports = bookController;
