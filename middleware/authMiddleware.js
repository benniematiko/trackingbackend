const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes – only logged-in users can access
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if the token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request (without the password)
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }
};

// 2. Restrict routes to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires one of these roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};