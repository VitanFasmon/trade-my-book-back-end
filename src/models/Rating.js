const pool = require("../db");

class Rating {
  static async createRating(userId, tradeId, rating, comment) {
    const result = await pool.query(
      `INSERT INTO Rating (user_id, trade_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, tradeId, rating, comment]
    );
    return result.rows[0];
  }

  static async getRatingsByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM Rating WHERE user_id = $1 ORDER BY date_rated DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getRatingsByTradeId(tradeId) {
    const result = await pool.query(
      `SELECT * FROM Rating WHERE trade_id = $1 ORDER BY date_rated DESC`,
      [tradeId]
    );
    return result.rows;
  }
  static async getAverageRatingByUserId(userId) {
    const result = await pool.query(
      `SELECT AVG(rating)::numeric(10,2) AS average_rating 
       FROM Rating WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0]?.average_rating || null;
  }
}

module.exports = Rating;
