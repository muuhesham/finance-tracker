import { verifyToken } from '../utils/jwt.js';
import { JWT_SECRET } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export function auth(request, _response, next) {
  const authorizationHeader = request.headers.authorization;
  const token = authorizationHeader?.split(" ")[1] || null;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyToken(token, JWT_SECRET);
    request.user = payload;
    next();
  } catch (_error) {
    next(new AppError("Unauthorized", 401));
  }
}
