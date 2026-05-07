import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    month: {
      type: String,
      required: true
    },
    insights: [
      {
        title: String,
        message: String,
        severity: {
          type: String,
          enum: ['info', 'warning', 'success']
        }
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

insightSchema.index({ userId: 1, month: 1 }, { unique: true });

export const InsightModel = mongoose.model('Insight', insightSchema);
