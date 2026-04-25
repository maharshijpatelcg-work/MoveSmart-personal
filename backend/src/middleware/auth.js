// MoveSmart — JWT Authentication Middleware
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorised — invalid token' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorised — no token' });
  }
};

export default protect;
