const Location = require("../models/Location");

exports.addLocation = async (req, res) => {
  const { address, lat, lng } = req.body;

  try {
    const location = await Location.addLocation(address, lat, lng);
    res.status(201).json({
      data: {
        message: "Location processed successfully",
        location_id: location.location_id,
      },
    });
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Failed to process location" });
  }
};

exports.findLocationById = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ data: location });
  } catch (error) {
    console.error("Error finding location by ID:", error);
    res.status(500).json({ message: "Failed to find location" });
  }
};

exports.findLocationByAddress = async (req, res) => {
  const { address } = req.query;

  try {
    const location = await Location.findByAddress(address);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ data: location });
  } catch (error) {
    console.error("Error finding location by address:", error);
    res.status(500).json({ message: "Failed to find location" });
  }
};
