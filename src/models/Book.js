const pool = require("../db");

class Book {
  static async addBook(
    user_id,
    google_books_api_id,
    condition,
    picture,
    trade_status
  ) {
    const newBook = await pool.query(
      "INSERT INTO book (user_id, google_books_api_id, condition, picture, trade_status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, google_books_api_id, condition, picture, trade_status]
    );
    return newBook.rows[0];
  }

  static async getBooksByLocation(location_id) {
    const books = await pool.query(
      "SELECT * FROM book WHERE user_id IN (SELECT user_id FROM app_user WHERE location_id = $1)",
      [location_id]
    );
    return books.rows;
  }
}

module.exports = Book;
