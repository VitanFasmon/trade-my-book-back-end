const Comment = require("../models/Comment");
const { getCommentsByTradeId, getCommentById } = require("../models/Comment");

const commentController = {
  addComment: async (req, res) => {
    const { trade_id, content } = req.body;
    const userId = req.user.user_id;

    try {
      const comment = await Comment.addComment(trade_id, userId, content);
      res.json({ data: comment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  },
  getCommentsByTradeId: async (req, res) => {
    const { trade_id } = req.params;
    try {
      const comments = await getCommentsByTradeId(trade_id);
      res.json({ data: comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  },
  getCommentById: async (req, res) => {
    const { comment_id } = req.params;
    try {
      const comment = await getCommentById(comment_id);
      res.json({ data: comment });
    } catch (error) {
      console.error("Error fetching comment:", error);
      res.status(500).json({ error: "Failed to fetch comment" });
    }
  },
};

module.exports = commentController;
