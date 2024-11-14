const pool = require("../db");

class Comment {
  static async addComment(tradeId, userId, content) {
    console.log(tradeId);
    const newComment = await pool.query(
      `INSERT INTO Comment (trade_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [tradeId, userId, content]
    );
    return newComment.rows[0];
  }

  static async getCommentsByTradeId(tradeId) {
    const comments = await pool.query(
      `SELECT * FROM Comment WHERE trade_id = $1 ORDER BY date_posted ASC`,
      [tradeId, userId]
    );
    return comments.rows;
  }

  static async getCommentById(commentId) {
    const comment = await pool.query(
      `SELECT * FROM Comment WHERE comment_id = $1`,
      [commentId]
    );
    return comment.rows[0];
  }
}

module.exports = Comment;
