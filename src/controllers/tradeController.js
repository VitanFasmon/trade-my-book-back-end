const Trade = require("../models/Trade");
const Book = require("../models/Book");

const tradeController = {
  // Create a trade offer
  createTrade: async (req, res) => {
    const { offered_book_id, requested_book_id } = req.body;
    const user_from = req.user.user_id;

    try {
      const offeredBook = await Book.findBookById(offered_book_id);
      const requestedBook = await Book.findBookById(requested_book_id);
      const user_to = requestedBook.added_by_user_id;
      if (!offeredBook || !requestedBook) {
        return res.status(404).json({
          error: "One or both books not found",
        });
      }
      if (!offeredBook.tradable || !requestedBook.tradable) {
        return res
          .status(400)
          .json({ error: "One or both books are not tradable" });
      }

      // Create trade offer
      const trade = await Trade.createTrade(
        offered_book_id,
        requested_book_id,
        user_from,
        user_to
      );
      res.status(201).json({ data: trade });
    } catch (error) {
      console.error("Error creating trade:", error);
      res.status(500).json({ error: "Failed to create trade" });
    }
  },

  // Fetch all trades for the authenticated user
  getTradesByUser: async (req, res) => {
    const userId = req.user.user_id;
    try {
      const trades = await Trade.getTradesByUser(userId);
      res.json({ data: trades });
    } catch (error) {
      console.error("Error fetching trades:", error);
      res.status(500).json({ error: "Failed to fetch trades" });
    }
  },

  // Update trade status (accept, reject, or cancel)
  updateTradeStatus: async (req, res) => {
    const { trade_id } = req.params;
    const { status } = req.body;
    const validStatuses = ["accepted", "rejected", "canceled"];

    // Check for valid status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      // Find the trade
      const trade = await Trade.getTradeById(trade_id);
      if (!trade) {
        return res.status(404).json({ error: "Trade not found" });
      }

      // Check authorization (only the recipient or initiator can modify the trade)
      if (
        req.user.user_id !== trade.user_from &&
        req.user.user_id !== trade.user_to
      ) {
        return res
          .status(403)
          .json({ error: "Unauthorized to modify this trade" });
      }

      // Update the trade status
      const updatedTrade = await Trade.updateTradeStatus(trade_id, status);

      // If trade is accepted, mark both books as non-tradable
      if (status === "accepted") {
        await Book.toggleTradableBookById(trade.offered_book_id, false);
        await Book.toggleTradableBookById(trade.requested_book_id, false);
      }

      res.json({
        data: updatedTrade,
        message: `Trade ${status} successfully.`,
      });
    } catch (error) {
      console.error("Error updating trade status:", error);
      res.status(500).json({ error: "Failed to update trade status" });
    }
  },
};

module.exports = tradeController;
