const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  const { user_id, trade_id, rating } = req.body;

  try {
    const newRating = await Rating.createRating(user_id, trade_id, rating);
    res.status(201).json({ data: newRating });
  } catch (error) {
    console.error("Error creating rating:", error.message);
    res
      .status(500)
      .json({ message: `Failed to create rating: ${error.message}` });
  }
};
exports.updateRating = async (req, res) => {
  const { user_id, trade_id, rating } = req.body;

  try {
    const newRating = await Rating.updateRating(user_id, trade_id, rating);
    res.status(201).json({ data: newRating });
  } catch (error) {
    console.error("Error updating rating:", error.message);
    res
      .status(500)
      .json({ message: `Failed to update rating: ${error.message}` });
  }
};
exports.getRatingsByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const ratings = await Rating.getRatingsByUserId(user_id);
    res.json({ data: ratings });
  } catch (error) {
    console.error("Error fetching user ratings:", error.message);
    res
      .status(500)
      .json({ message: `Failed to fetch ratings: ${error.message}` });
  }
};

exports.getRatingsByTradeId = async (req, res) => {
  const { trade_id } = req.params;
  try {
    const ratings = await Rating.getRatingsByTradeId(trade_id);
    res.json({ data: ratings });
  } catch (error) {
    console.error("Error fetching trade ratings:", error.message);
    res
      .status(500)
      .json({ message: `Failed to fetch ratings: ${error.message}` });
  }
};

exports.getAverageRatingByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const averageRating = await Rating.getAverageRatingByUserId(user_id);

    res.json({ data: { averageRating } });
  } catch (error) {
    console.error("Error fetching average rating:", error.message);
    res
      .status(500)
      .json({ message: `Failed to fetch average rating: ${error.message}` });
  }
};
