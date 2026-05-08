import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['telegram', 'discord'], required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// MongoDB TTL index auto-deletes expired tokens
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingTokenModel = mongoose.model('PendingToken', schema);
