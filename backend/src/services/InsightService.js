import { resolveMonthRange } from "../utils/date.js";
import { InsightModel } from "../models/Insight.js";
import { foodSpendInsight, savingsRateInsight, transportIncreaseInsight } from "./insightGenerators.js";

function resolveQuery(query) {
  return typeof query?.lean === "function" ? query.lean() : query;
}

function summarizeTransactions(transactions) {
  return transactions.reduce(
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
}

export function createInsightService({
  transactionModel,
  insightModel = InsightModel,
  insightGenerators = [
    foodSpendInsight,
    transportIncreaseInsight,
    savingsRateInsight,
  ],
}) {
  return {
    async generateMonthlyInsights(userId, monthValue) {
      const range = resolveMonthRange(monthValue);
      const cachedInsights = await resolveQuery(
        insightModel.findOne({ userId, month: range.monthKey }),
      );

      if (cachedInsights) {
        return {
          month: range.monthKey,
          insights: cachedInsights.insights,
        };
      }

      const [currentTransactions, previousTransactions] = await Promise.all([
        resolveQuery(
          transactionModel.find({
            userId,
            transactionDate: {
              $gte: range.startDate,
              $lt: range.endDate,
            },
          }),
        ),
        resolveQuery(
          transactionModel.find({
            userId,
            transactionDate: {
              $gte: range.previousStartDate,
              $lt: range.previousEndDate,
            },
          }),
        ),
      ]);

      const currentSummary = summarizeTransactions(currentTransactions);
      const previousSummary = summarizeTransactions(previousTransactions);
      const insights = insightGenerators
        .map((generator) => generator({ currentSummary, previousSummary }))
        .filter(Boolean);

      const finalInsights = insights.length
        ? insights
        : [
            {
              title: "Your spending looks stable",
              message:
                "No major budget risks were detected this month. Keep logging transactions to maintain reliable insights.",
              severity: "success",
            },
          ];

      await resolveQuery(
        insightModel.findOneAndUpdate(
          { userId, month: range.monthKey },
          { insights: finalInsights },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        ),
      );

      return {
        month: range.monthKey,
        insights: finalInsights,
      };
    },
  };
}
