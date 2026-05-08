import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Bot tokens — optional; only needed for the platform you configure
const TELEGRAM_BOT_TOKEN      = process.env.TELEGRAM_BOT_TOKEN      || null;
const DISCORD_BOT_TOKEN       = process.env.DISCORD_BOT_TOKEN       || null;
const DISCORD_PUBLIC_KEY      = process.env.DISCORD_PUBLIC_KEY      || null;
const DISCORD_APPLICATION_ID  = process.env.DISCORD_APPLICATION_ID  || null;

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
  CLIENT_URL,
  TELEGRAM_BOT_TOKEN,
  DISCORD_BOT_TOKEN,
  DISCORD_PUBLIC_KEY,
  DISCORD_APPLICATION_ID,
};
