const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, phone_number, password, location_id } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM app_user WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO app_user (name, email, phone_number, password, location_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone_number, hashedPassword, location_id]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM app_user WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user;

    res.json({ token, data: userData });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `Something went wrong: ${error.message}` });
  }
};

exports.getUserData = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const user = await User.findByUserId(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

exports.getUserDataByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findByUserEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

exports.updateUserLocationById = async (req, res) => {
  const userId = req.user.user_id;
  const { location_id } = req.body;
  try {
    const updatedUser = await User.updateUserLocationById(userId, location_id);
    res.json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user location" });
  }
};
