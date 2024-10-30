const pool = require("../db");

class Location {
  static async addLocation(address, latitude, longitude) {
    const existingLocation = await pool.query(
      "SELECT * FROM location WHERE address = $1",
      [address]
    );

    if (existingLocation.rows.length > 0) {
      return existingLocation.rows[0];
    } else {
      const newLocation = await pool.query(
        "INSERT INTO location (address, latitude, longitude) VALUES ($1, $2, $3) RETURNING *",
        [address, latitude, longitude]
      );
      return newLocation.rows[0];
    }
  }

  static async findById(locationId) {
    const location = await pool.query(
      "SELECT * FROM location WHERE location_id = $1",
      [locationId]
    );
    return location.rows[0];
  }

  static async findByAddress(address) {
    const location = await pool.query(
      "SELECT * FROM location WHERE address = $1",
      [address]
    );
    return location.rows[0];
  }
}

module.exports = Location;
