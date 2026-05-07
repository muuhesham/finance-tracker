import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is required');
}

if (!JWT_SECRET || JWT_SECRET.length < 12) {
  throw new Error('JWT_SECRET must be at least 12 characters');
}

export const env = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  CLIENT_URL
};
