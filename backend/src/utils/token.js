import jwt from 'jsonwebtoken';

export function signToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
