// middleware/auth.js
const jwt = require("jsonwebtoken");
const pool = require("../db");

async function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT * FROM app_user WHERE user_id = $1",
      [decoded.user_id]
    );

    const user = result.rows[0];
    if (!user || !user.is_active) {
      return res.status(403).json({ error: "Account not activated" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = authenticateToken;
