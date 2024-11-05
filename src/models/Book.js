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
  static async searchBooks({
    title,
    author,
    conditionMin = 1,
    conditionMax = 10,
    userId = null, // Optional, only used when logged in
    lat = null, // Optional, used for location-based filtering
    lon = null, // Optional, used for location-based filtering
    radiusKm = null, // Optional, used for location-based filtering
    sortField = "date_added",
    sortOrder = "ASC",
    limit = 10,
    offset = 0,
  }) {
    console.log(
      "title: " + title,
      ", author: " + author,
      ", conditionMin: " + conditionMin,
      ", conditionMax; " + conditionMax,
      ", userId; " + userId,
      ", lat; " + lat,
      ", lon: " + lon,
      ", radiusKm: " + radiusKm,
      ", limit: " + limit,
      ", offset: " + offset
    );
    const params = [];
    let query = `
      SELECT Book.*, App_User.location_id, Location.latitude, Location.longitude
      FROM Book
      JOIN App_User ON Book.added_by_user_id = App_User.user_id
      JOIN Location ON App_User.location_id = Location.location_id
      WHERE 1=1
    `;

    // Exclude books by the logged-in user if userId is provided
    if (userId) {
      params.push(userId);
      query += ` AND Book.added_by_user_id != $${params.length}`;
    }

    if (title) {
      params.push(`%${title}%`);
      query += ` AND Book.title ILIKE $${params.length}`;
    }

    if (author) {
      params.push(`%${author}%`);
      query += ` AND Book.author ILIKE $${params.length}`;
    }

    if (conditionMin) {
      params.push(conditionMin);
      query += ` AND Book.book_condition >= $${params.length}`;
    }
    if (conditionMax) {
      params.push(conditionMax);
      query += ` AND Book.book_condition <= $${params.length}`;
    }

    if (lat && lon && radiusKm) {
      const earthRadiusKm = 6371; // Radius of the Earth in km
      const radiusDegrees = radiusKm / earthRadiusKm;

      params.push(lat, lon, radiusDegrees);
      query += `
        AND ST_DWithin(
          ST_MakePoint(Location.longitude, Location.latitude)::geography,
          ST_MakePoint($${params.length - 1}, $${params.length})::geography,
          $${params.length + 1} * 1000
        )
      `;
    }

    const validSortFields = [
      "date_added",
      "title",
      "author",
      "published_date",
      "book_condition",
    ];
    if (!validSortFields.includes(sortField)) sortField = "date_added";
    query += ` ORDER BY Book.${sortField} ${
      sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"
    }`;

    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    return result.rows;
  }
}

module.exports = Book;
