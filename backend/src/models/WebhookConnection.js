import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['telegram', 'discord'], required: true },
    chatId: { type: String, required: true },
    username: { type: String, default: '' },
  },
  { timestamps: true }
);

schema.index({ platform: 1, chatId: 1 }, { unique: true });
schema.index({ userId: 1 });

export const WebhookConnectionModel = mongoose.model('WebhookConnection', schema);
