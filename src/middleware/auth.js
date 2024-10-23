const jwt = require("jsonwebtoken");

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Authorization header
  if (!token) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Save user info in request
    next(); // Proceed to next middleware
  });
}

module.exports = authenticateToken;
