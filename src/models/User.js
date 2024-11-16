const pool = require("../db");
const bcrypt = require("bcrypt");

class User {
  static async register(name, email, phone_number, password, location_id) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO app_user (name, email, phone_number, password, location_id,registration_date ) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, phone_number, hashedPassword, location_id]
    );
    return newUser.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      "SELECT name, email, phone_number,location_id ,registration_date FROM App_User WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  }
  static async getAcceptedTradesIdsByUserId(userId) {
    const result = await pool.query(
      "SELECT trade_id FROM trade WHERE (user_from = $1 OR user_to = $1) AND status = 'accepted'",

      [userId]
    );
    return result.rows.map((row) => row.trade_id);
  }
  static async findByUserEmail(email) {
    const result = await pool.query(
      "SELECT name, email, phone_number,location_id,registration_date  FROM App_User WHERE email = $1",
      [email]
    );
    return result.rows[0];
  }

  static async updateUserName(userId, name) {
    const result = await pool.query(
      "UPDATE app_user  SET name = $1 WHERE user_id = $2 RETURNING name,email,phone_number,location_id,registration_date ,is_active",
      [name, userId]
    );
    return result.rows[0];
  }
  static async updateUserPhoneNumber(userId, phone_number) {
    const result = await pool.query(
      "UPDATE app_user  SET phone_number = $1 WHERE user_id = $2 RETURNING name,email,phone_number,registration_date ,location_id,is_active",
      [phone_number, userId]
    );
    return result.rows[0];
  }

  static async updateUserLocationById(userId, locationId) {
    const result = await pool.query(
      "UPDATE app_user  SET location_id = $1 WHERE user_id = $2 RETURNING name,email,phone_number,registration_date ,location_id,is_active",
      [locationId, userId]
    );
    return result.rows[0];
  }
}

module.exports = User;
