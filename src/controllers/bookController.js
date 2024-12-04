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
  getPublicBooksByUser: async (req, res) => {
    const { user_id } = req.params;
    try {
      const books = await Book.getPublicBooksByUser(user_id);
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
  findBookById: async (req, res) => {
    const { book_id } = req.params;
    try {
      const book = await Book.findBookById(book_id);

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json({ data: book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get book" });
    }
  },
  findBookOwnerById: async (req, res) => {
    const { book_id } = req.params;
    try {
      const book = await Book.findBookOwnerById(book_id);

      if (!book) {
        return res.status(404).json({ error: "Book owner not found" });
      }

      res.json({ data: book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get book owner" });
    }
  },
  updateBookById: async (req, res) => {
    const userId = req.user.user_id;
    const {
      book_id,
      added_by_user_id,
      date_added,
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
      const book = await Book.findBookById(book_id);

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.added_by_user_id !== userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this book" });
      }

      const updatedBook = await Book.updateBookById(
        book_id,
        date_added,
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
      res.json({
        data: updatedBook,
        message: "Book updated successfully.",
      });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ error: "Failed to update book" });
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
  searchBooks: async (req, res, next) => {
    try {
      const {
        title,
        author,
        conditionMin,
        conditionMax,
        lat,
        lon,
        radiusKm,
        sortField,
        sortOrder,
        limit = 10,
        offset = 0,
      } = req.query;

      const userId = req.user ? req.user.user_id : null;
      const books = await Book.searchBooks({
        title,
        author,
        conditionMin: parseInt(conditionMin, 10) || 1,
        conditionMax: parseInt(conditionMax, 10) || 10,
        userId,
        lat: parseFloat(lat) || null,
        lon: parseFloat(lon) || null,
        radiusKm: parseFloat(radiusKm) || null,
        sortField,
        sortOrder,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

      res.json({ data: books });
    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).json({ error: "Failed to search books" });
    }
  },
};

module.exports = bookController;
