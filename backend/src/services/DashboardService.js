import mongoose from "mongoose";
import { formatMonthLabel, resolveMonthRange } from "../utils/date.js";

function roundCurrency(value) {
  return Number(value.toFixed(2));
}

function normalizeTransaction(transaction) {
  return {
    id: transaction._id.toString(),
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note,
    transactionDate: transaction.transactionDate,
  };
}

function buildMonthlyTrend(records) {
  const monthlyMap = new Map();

  for (const record of records) {
    const month = record._id.month;
    const current = monthlyMap.get(month) ?? { month, income: 0, expense: 0 };
    current[record._id.type] = roundCurrency(record.totalAmount);
    monthlyMap.set(month, current);
  }

  return [...monthlyMap.values()]
    .sort((left, right) => left.month.localeCompare(right.month))
    .map((item) => ({
      ...item,
      label: formatMonthLabel(item.month),
    }));
}

export function createDashboardService({ transactionModel }) {
  return {
    async getMonthlySummary(userId, monthValue) {
      const range = resolveMonthRange(monthValue);
      const currentTransactions = await transactionModel
        .find({
          userId,
          transactionDate: {
            $gte: range.startDate,
            $lt: range.endDate,
          },
        })
        .sort({ transactionDate: -1, createdAt: -1 })
        .lean();

      const monthlyTrendSource = await transactionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: {
              month: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$transactionDate",
                },
              },
              type: "$type",
            },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.month": -1,
          },
        },
        {
          $limit: 12,
        },
      ]);

      const totals = currentTransactions.reduce(
        (summary, transaction) => {
          summary[transaction.type] += transaction.amount;

          if (transaction.type === "expense") {
            summary.expenseByCategory[transaction.category] =
              (summary.expenseByCategory[transaction.category] ?? 0) +
              transaction.amount;
          }

          return summary;
        },
        {
          income: 0,
          expense: 0,
          expenseByCategory: {},
        },
      );

      const categoryBreakdown = Object.entries(totals.expenseByCategory)
        .map(([category, amount]) => ({
          category,
          amount: roundCurrency(amount),
        }))
        .sort((left, right) => right.amount - left.amount);

      return {
        month: range.monthKey,
        monthLabel: formatMonthLabel(range.monthKey),
        totals: {
          income: roundCurrency(totals.income),
          expense: roundCurrency(totals.expense),
          balance: roundCurrency(totals.income - totals.expense),
        },
        categoryBreakdown,
        recentTransactions: currentTransactions
          .slice(0, 8)
          .map(normalizeTransaction),
        monthlyTrend: buildMonthlyTrend(monthlyTrendSource),
      };
    },
  };
}
