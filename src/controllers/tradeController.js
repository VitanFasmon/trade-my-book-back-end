const Trade = require("../models/Trade");
const Book = require("../models/Book");
const User = require("../models/User");
const Location = require("../models/Location");
const {
  sendEmail,
  createTradeEmailContent,
  updateTradeEmailContent,
} = require("../utils/emailService");

const tradeController = {
  createTrade: async (req, res) => {
    const { offered_book_id, requested_book_id } = req.body;
    const user_from = req.user.user_id;

    try {
      const offeredBook = await Book.findBookById(offered_book_id);
      const requestedBook = await Book.findBookById(requested_book_id);
      const user_to = requestedBook.added_by_user_id;

      if (!offeredBook || !requestedBook) {
        return res.status(404).json({ error: "One or both books not found" });
      }
      if (!offeredBook.tradable || !requestedBook.tradable) {
        return res
          .status(400)
          .json({ error: "One or both books are not tradable" });
      }

      const trade = await Trade.createTrade(
        offered_book_id,
        requested_book_id,
        user_from,
        user_to
      );

      const initiator = await User.findByUserId(user_from);
      const recipient = await User.findByUserId(user_to);
      const initiatorAddress = initiator.location_id
        ? await Location.findById(initiator.location_id)
        : null;

      const recipientAddress = recipient.location_id
        ? await Location.findById(recipient.location_id)
        : null;

      await sendEmail(
        recipient.email,
        "New Trade Offer",
        createTradeEmailContent({
          recipientName: recipient.name,
          initiatorName: initiator.name,
          initiatorEmail: initiator.email,
          offeredBookTitle: offeredBook.title,
          requestedBookTitle: requestedBook.title,
          initiatorAddress: JSON.parse(recipientAddress.address),
          recipientAddress: JSON.parse(initiatorAddress.address),
          tradeLink: `${process.env.FRONTEND_URL}/trades/${trade.trade_id}`,
        })
      );

      res.status(201).json({ data: trade });
    } catch (error) {
      console.error("Error creating trade:", error);
      res.status(500).json({ error: "Failed to create trade" });
    }
  },

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

  getTradeById: async (req, res) => {
    const userId = req.user.user_id;
    const { trade_id } = req.params;

    try {
      const trade = await Trade.getTradeById(trade_id);
      if (!trade) {
        return res.status(404).json({ error: "Trade not found" });
      }
      if (userId !== trade.user_to && userId !== trade.user_from) {
        return res
          .status(403)
          .json({ error: "Unauthorized to view this trade" });
      }

      res.json({ data: trade });
    } catch (error) {
      console.error("Error fetching trade:", error);
      res.status(500).json({ error: "Failed to fetch trade" });
    }
  },
  getPublicTradeById: async (req, res) => {
    const { trade_id } = req.params;

    try {
      const trade = await Trade.getPublicTradeById(trade_id);
      if (!trade) {
        return res.status(404).json({ error: "Trade not found" });
      }
      res.json({ data: trade });
    } catch (error) {
      console.error("Error fetching trade:", error);
      res.status(500).json({ error: "Failed to fetch trade" });
    }
  },
  updateTradeStatus: async (req, res) => {
    const { trade_id } = req.params;
    const { status } = req.body;
    const validStatuses = ["accepted", "rejected", "canceled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      const trade = await Trade.getTradeById(trade_id);
      if (!trade) {
        return res.status(404).json({ error: "Trade not found" });
      }

      const offeredBook = await Book.findBookById(trade.offered_book_id);
      const requestedBook = await Book.findBookById(trade.requested_book_id);

      if (!offeredBook || !requestedBook) {
        return res.status(404).json({ error: "One or both books not found" });
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

      const updatedTrade = await Trade.updateTradeStatus(trade_id, status);

      if (status === "accepted") {
        await Book.toggleTradableBookById(trade.offered_book_id, false);
        await Book.toggleTradableBookById(trade.requested_book_id, false);
      }

      const initiator = await User.findByUserId(trade.user_from);
      const recipient = await User.findByUserId(trade.user_to);
      const initiatorAddress = initiator.location_id
        ? await Location.findById(initiator.location_id)
        : null;
      const recipientAddress = recipient.location_id
        ? await Location.findById(recipient.location_id)
        : null;

      await sendEmail(
        initiator.email,
        `Trade ${status}`,
        updateTradeEmailContent({
          recipientName: initiator.name,
          initiatorName: recipient.name,
          offeredBookTitle: requestedBook.title,
          requestedBookTitle: offeredBook.title,
          initiatorAddress: JSON.parse(recipientAddress.address),
          recipientAddress: JSON.parse(initiatorAddress.address),
          tradeLink: `${process.env.FRONTEND_URL}/trades/${trade.trade_id}`,
          status: status,
        })
      );
      await sendEmail(
        recipient.email,
        `Trade ${status}`,
        updateTradeEmailContent({
          recipientName: recipient.name,
          initiatorName: initiator.name,
          offeredBookTitle: offeredBook.title,
          requestedBookTitle: requestedBook.title,
          initiatorAddress: JSON.parse(initiatorAddress.address),
          recipientAddress: JSON.parse(recipientAddress.address),
          tradeLink: `${process.env.FRONTEND_URL}/trades/${trade.trade_id}`,
          status: status,
        })
      );
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
