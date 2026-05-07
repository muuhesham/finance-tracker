import { AppError } from "../utils/errors.js";

function normalizeResult(transaction) {
  return {
    id: transaction._id.toString(),
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note,
    transactionDate: transaction.transactionDate,
    createdAt: transaction.createdAt,
  };
}

function resolveQuery(query) {
  return typeof query.lean === "function" ? query.lean() : query;
}

export function createTransactionService({ transactionModel }) {
  return {
    async create(userId, payload) {
      const transaction = await transactionModel.create({
        userId,
        type: payload.type,
        amount: payload.amount,
        category: payload.category,
        note: payload.note ?? "",
        transactionDate: new Date(payload.transactionDate),
      });

      return normalizeResult(transaction);
    },

    async update(userId, transactionId, payload) {
      const transaction = await resolveQuery(
        transactionModel.findOneAndUpdate(
          { _id: transactionId, userId },
          {
            type: payload.type,
            amount: payload.amount,
            category: payload.category,
            note: payload.note ?? "",
            transactionDate: new Date(payload.transactionDate),
          },
          { new: true, runValidators: true },
        ),
      );

      if (!transaction) {
        throw new AppError("Transaction not found", 404);
      }

      return normalizeResult(transaction);
    },

    async remove(userId, transactionId) {
      const transaction = await resolveQuery(
        transactionModel.findOneAndDelete({ _id: transactionId, userId }),
      );

      if (!transaction) {
        throw new AppError("Transaction not found", 404);
      }
    },

    async listRecent(userId, limit = 10) {
      const transactions = await resolveQuery(
        transactionModel
          .find({ userId })
          .sort({ transactionDate: -1, createdAt: -1 })
          .limit(limit),
      );

      return transactions.map(normalizeResult);
    },
  };
}
