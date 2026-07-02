import jwt from 'jsonwebtoken';

const expirationTime = '7h';

export function signToken(payload, secretkey) {
  return jwt.sign(payload, secretkey, { expiresIn: expirationTime });
}

export function verifyToken(token, secretkey) {
  return jwt.verify(token, secretkey);
}
