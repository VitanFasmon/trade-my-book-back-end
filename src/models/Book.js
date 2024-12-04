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
  static async updateBookById(
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
  ) {
    const updatedBook = await pool.query(
      "UPDATE Book SET title=$2, subtitle=$3, author=$4, language=$5, published_date=$6, categories=$7, description=$8, isbn=$9, google_books_id=$10, cover_url=$11, book_condition=$12, tradable=$13 ,date_added=$14 WHERE book_id = $1 RETURNING *",
      [
        book_id,
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
        date_added,
      ]
    );
    return updatedBook.rows[0];
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
  static async findBookOwnerById(book_id) {
    const book = await pool.query(
      "SELECT added_by_user_id FROM Book WHERE book_id = $1",
      [book_id]
    );
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
  static async getPublicBooksByUser(added_by_user_id) {
    const books = await pool.query(
      "SELECT * FROM Book WHERE added_by_user_id = $1 AND tradable = true",
      [added_by_user_id]
    );
    return books.rows;
  }
  static async searchBooks({
    title,
    author,
    conditionMin = 1,
    conditionMax = 10,
    userId = null,
    lat = null,
    lon = null,
    radiusKm = null,
    sortField = "date_added",
    sortOrder = "ASC",
    limit = 10,
    offset = 0,
  }) {
    const params = [];
    let query = `
      SELECT Book.*, App_User.location_id, Location.latitude, Location.longitude
      FROM Book
      JOIN App_User ON Book.added_by_user_id = App_User.user_id
      JOIN Location ON App_User.location_id = Location.location_id
      WHERE tradable = true
    `;

    // Exclude books added by the current user
    if (userId) {
      params.push(userId);
      query += ` AND Book.added_by_user_id != $${params.length}`;
    }

    // Filter by title if provided
    if (title) {
      params.push(`%${title}%`);
      query += ` AND Book.title ILIKE $${params.length}`;
    }

    // Filter by author if provided
    if (author) {
      params.push(`%${author}%`);
      query += ` AND Book.author ILIKE $${params.length}`;
    }

    // Condition filter
    if (conditionMin) {
      params.push(conditionMin);
      query += ` AND Book.book_condition >= $${params.length}`;
    }
    if (conditionMax) {
      params.push(conditionMax);
      query += ` AND Book.book_condition <= $${params.length}`;
    }

    // Proximity filter using lat, lon, and radiusKm
    if (lat && lon && radiusKm) {
      // Push user’s latitude and longitude as params
      params.push(lat, lon);
      query += `
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(Location.longitude, Location.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint($${params.length}, $${
        params.length - 1
      }), 4326)::geography,
          ${radiusKm * 1000}  -- Convert radius from km to meters
        )
      `;
    }

    // Validate and add sorting
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

    // Apply pagination
    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    // Execute the query
    const result = await pool.query(query, params);
    return result.rows;
  }
}
module.exports = Book;
