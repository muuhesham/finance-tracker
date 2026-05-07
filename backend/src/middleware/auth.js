import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export function authenticate(request, _response, next) {
  const authorizationHeader = request.headers.authorization;
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : null;

  if (!token) {
    return next(new AppError('Authentication token is required', 401));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    request.user = payload;
    next();
  } catch (_error) {
    next(new AppError('Authentication token is invalid or expired', 401));
  }
}
