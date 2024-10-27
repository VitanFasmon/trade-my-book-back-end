const pool = require("../db");

class Book {
  static async addBook(
    title,
    author,
    description,
    isbn,
    google_books_id,
    added_by_user_id,
    cover_url,
    book_condition
  ) {
    const newBook = await pool.query(
      "INSERT INTO Book (title, author, description, isbn, google_books_id, added_by_user_id, cover_url, book_condition) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        title,
        author,
        description,
        isbn,
        google_books_id,
        added_by_user_id,
        cover_url,
        book_condition,
      ]
    );
    return newBook.rows[0];
  }

  static async getBooksByLocation(location_id) {
    const books = await pool.query(
      "SELECT * FROM Book WHERE added_by_user_id IN (SELECT user_id FROM App_User WHERE location_id = $1)",
      [location_id]
    );
    return books.rows;
  }
}

module.exports = Book;
