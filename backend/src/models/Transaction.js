import mongoose from "mongoose";
import { transactionCategories } from "../constants/transactionCategories.js";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: String,
      enum: transactionCategories,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    transactionDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

transactionSchema.index({ userId: 1, transactionDate: -1 });

export const TransactionModel = mongoose.model(
  "Transaction",
  transactionSchema,
);
