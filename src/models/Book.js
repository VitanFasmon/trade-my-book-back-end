const pool = require("../db");

class Book {
  static async addBook(
    added_by_user_id,
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
  ) {
    if (/^\d{4}$/.test(published_date)) {
      published_date = `${published_date}-01-01`;
    }

    const newBook = await pool.query(
      "INSERT INTO Book (added_by_user_id, title, subtitle, author, language, published_date, categories, description, isbn, google_books_id, cover_url, book_condition,tradable) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
      [
        added_by_user_id,
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
      ]
    );
    return newBook.rows[0];
  }

  static async removeBookById(book_id) {
    const removedBook = await pool.query(
      "DELETE FROM Book WHERE book_id = $1 RETURNING *",
      [book_id]
    );
    return removedBook.rows[0];
  }
  static async toggleTradableBookById(book_id, tradable) {
    const updatedBook = await pool.query(
      "UPDATE Book SET tradable = $1 WHERE book_id = $2 RETURNING *",
      [tradable, book_id]
    );
    return updatedBook.rows[0];
  }
  static async findBookById(book_id) {
    const book = await pool.query("SELECT * FROM Book WHERE book_id = $1", [
      book_id,
    ]);
    return book.rows[0];
  }

  static async getBooksByLocation(location_id) {
    const books = await pool.query(
      "SELECT * FROM Book WHERE added_by_user_id IN (SELECT user_id FROM App_User WHERE location_id = $1)",
      [location_id]
    );
    return books.rows;
  }

  static async getBooksByUser(added_by_user_id) {
    const books = await pool.query(
      "SELECT * FROM Book WHERE added_by_user_id = $1",
      [added_by_user_id]
    );
    return books.rows;
  }
}

module.exports = Book;
