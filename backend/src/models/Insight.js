import mongoose, { Schema } from "mongoose";
import { insightSeverity } from "../constants/insightSeverity.js";

const insightSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
          enum: Object.values(insightSeverity)
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
