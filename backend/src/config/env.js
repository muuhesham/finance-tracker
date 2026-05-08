import dotenv from 'dotenv';
import validEnvVariables from '../validators/env-validator.js';

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 8000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

validEnvVariables(config);

export const { PORT, CLIENT_URL, MONGODB_URI, JWT_SECRET } = config;
