const pool = require("../db");

class Rating {
  static async createRating(userId, tradeId, rating) {
    const result = await pool.query(
      `INSERT INTO Rating (user_id, trade_id, rating)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, tradeId, rating]
    );
    return result.rows[0];
  }
  static async updateRating(userId, tradeId, rating) {
    const result = await pool.query(
      `UPDATE Rating SET user_id=$1, trade_id=$2, rating=$3 WHERE trade_id = $2 AND user_id = $1
       RETURNING *`,
      [userId, tradeId, rating]
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
