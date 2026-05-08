import jwt from 'jsonwebtoken';

export function signToken(payload, secretkey) {
  return jwt.sign(payload, secretkey, { expiresIn: '7d' });
}
