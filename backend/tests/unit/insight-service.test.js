import { describe, expect, it } from "vitest";
import { createInsightService } from "../../src/services/InsightService.js";
import {
  foodSpendInsight,
  savingsRateInsight,
  transportIncreaseInsight,
} from "../../src/services/insightGenerators.js";
import { resolveMonthRange } from "../../src/utils/date.js";

function createTransactionRepositoryStub(dataset) {
  return {
    async find(filter) {
      const range = resolveMonthRange("2026-03");

      if (filter.transactionDate.$gte.getTime() === range.startDate.getTime()) {
        return dataset.current;
      }

      return dataset.previous;
    },
  };
}

function createInsightRepositoryStub() {
  let snapshot = null;

  return {
    async findOne() {
      return snapshot;
    },
    async findOneAndUpdate(_filter, update) {
      snapshot = { ...update, month: update.month };
      return snapshot;
    },
  };
}

describe("InsightService", () => {
  it("generates smart financial insights from monthly behavior", async () => {
    const transactionModel = createTransactionRepositoryStub({
      current: [
        { type: "income", amount: 4000, category: "salary", userId: "user-1" },
        { type: "expense", amount: 1500, category: "food", userId: "user-1" },
        {
          type: "expense",
          amount: 600,
          category: "transport",
          userId: "user-1",
        },
        { type: "expense", amount: 1500, category: "bills", userId: "user-1" },
      ],
      previous: [
        { type: "income", amount: 3800, category: "salary", userId: "user-1" },
        {
          type: "expense",
          amount: 300,
          category: "transport",
          userId: "user-1",
        },
      ],
    });

    const insightModel = createInsightRepositoryStub();

    const service = createInsightService({
      transactionModel,
      insightModel,
      insightGenerators: [
        foodSpendInsight,
        transportIncreaseInsight,
        savingsRateInsight,
      ],
    });

    const result = await service.generateMonthlyInsights("user-1", "2026-03");

    expect(result.month).toBe("2026-03");
    expect(result.insights).toHaveLength(3);
    expect(result.insights.map((insight) => insight.title)).toContain(
      "Transport costs increased",
    );
  });

  it("returns a stable message when no risks are detected", async () => {
    const transactionModel = createTransactionRepositoryStub({
      current: [
        { type: "income", amount: 5000, category: "salary", userId: "user-1" },
        { type: "expense", amount: 500, category: "food", userId: "user-1" },
        {
          type: "expense",
          amount: 1000,
          category: "housing",
          userId: "user-1",
        },
      ],
      previous: [
        { type: "income", amount: 4800, category: "salary", userId: "user-1" },
        { type: "expense", amount: 450, category: "food", userId: "user-1" },
      ],
    });

    const insightModel = createInsightRepositoryStub();

    const service = createInsightService({
      transactionModel,
      insightModel,
      insightGenerators: [foodSpendInsight, transportIncreaseInsight],
    });

    const result = await service.generateMonthlyInsights("user-1", "2026-03");

    expect(result.insights).toHaveLength(1);
    expect(result.insights[0].severity).toBe("success");
  });
});
