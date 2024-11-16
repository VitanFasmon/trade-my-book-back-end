const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  const { userId, tradeId, rating, comment } = req.body;

  try {
    const newRating = await Rating.createRating(
      userId,
      tradeId,
      rating,
      comment
    );
    res.status(201).json({ data: newRating });
  } catch (error) {
    console.error("Error creating rating:", error.message);
    res
      .status(500)
      .json({ message: `Failed to create rating: ${error.message}` });
  }
};

exports.getRatingsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const ratings = await Rating.getRatingsByUserId(userId);
    res.json({ data: ratings });
  } catch (error) {
    console.error("Error fetching user ratings:", error.message);
    res
      .status(500)
      .json({ message: `Failed to fetch ratings: ${error.message}` });
  }
};

exports.getRatingsByTradeId = async (req, res) => {
  const { tradeId } = req.params;

  try {
    const ratings = await Rating.getRatingsByTradeId(tradeId);
    res.json({ data: ratings });
  } catch (error) {
    console.error("Error fetching trade ratings:", error.message);
    res
      .status(500)
      .json({ message: `Failed to fetch ratings: ${error.message}` });
  }
};

exports.getAverageRatingByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const averageRating = await Rating.getAverageRatingByUserId(userId);
    if (averageRating === null) {
      return res
        .status(404)
        .json({ message: "No ratings found for this user." });
    }
    res.json({ data: { averageRating } });
  } catch (error) {
    console.error("Error fetching average rating:", error.message);
    res
      .status(500)
      .json({ message: `Failed to fetch average rating: ${error.message}` });
  }
};
