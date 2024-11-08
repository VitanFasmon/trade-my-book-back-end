const pool = require("../db");
const Book = require("../models/Book");

class Trade {
  // Create a new trade offer
  static async createTrade(
    offered_book_id,
    requested_book_id,
    user_from,
    user_to
  ) {
    const newTrade = await pool.query(
      `INSERT INTO Trade (offered_book_id, requested_book_id, user_from, user_to, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [offered_book_id, requested_book_id, user_from, user_to]
    );
    return newTrade.rows[0];
  }

  // Get trades involving a specific user
  static async getTradesByUser(userId) {
    const trades = await pool.query(
      `SELECT * FROM Trade WHERE user_from = $1 OR user_to = $1 ORDER BY trade_date DESC`,
      [userId]
    );
    return trades.rows;
  }

  // Get a trade by ID
  static async getTradeById(tradeId) {
    const trade = await pool.query(`SELECT * FROM Trade WHERE trade_id = $1`, [
      tradeId,
    ]);
    return trade.rows[0];
  }

  // Update trade status
  static async updateTradeStatus(tradeId, status) {
    const updatedTrade = await pool.query(
      `UPDATE Trade SET status = $1 WHERE trade_id = $2 RETURNING *`,
      [status, tradeId]
    );
    return updatedTrade.rows[0];
  }
}

module.exports = Trade;
