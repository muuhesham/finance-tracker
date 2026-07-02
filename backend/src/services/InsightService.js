import { resolveMonthRange } from "../utils/date.js";
import { InsightModel } from "../models/Insight.js";
import { foodSpendInsight, savingsRateInsight, transportIncreaseInsight } from "./insightGenerators.js";
import { resolveQuery } from "../utils/resolveQuery.js";
import { summarizeTransactions } from "../utils/summarizeTransactions.js";

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

      return {
        month: range.monthKey,
        insights: finalInsights,
      };
    },
  };
}
