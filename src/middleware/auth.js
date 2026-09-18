import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware to authenticate requests via JWT Bearer token.
 * Populates `req.user` with decoded token payload `{ id, email, role }`.
 */
export const authenticate = (req, res, next) => {
  let token;

  // 1. Check for token in httpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization: Bearer <token> header (for mobile/Postman)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication token missing. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Authentication token has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid authentication token', 401));
  }
};

/**
 * Role-based access control middleware.
 * Ensures the authenticated user has at least one of the required roles.
 *
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'customer')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

export default { authenticate, authorize };
