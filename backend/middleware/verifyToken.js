const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; 
  
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.id; // Save user ID for use in the route
    next();
  });
};

module.exports = verifyToken;