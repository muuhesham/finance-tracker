import { describe, expect, it } from "vitest";
import { createInsightService } from "../../src/services/InsightService.js";
import {
  foodSpendInsight,
  savingsRateInsight,
  transportIncreaseInsight,
} from "../../src/services/insightGenerators.js";

function createTransactionRepositoryStub(dataset) {
  return {
    async find(filter) {
      if (filter.transactionDate.$gte.getUTCMonth() === 2) {
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
        { type: "income", amount: 4000, category: "salary" },
        { type: "expense", amount: 1500, category: "food" },
        { type: "expense", amount: 600, category: "transport" },
        { type: "expense", amount: 1500, category: "bills" },
      ],
      previous: [
        { type: "income", amount: 3800, category: "salary" },
        { type: "expense", amount: 300, category: "transport" },
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
        { type: "income", amount: 5000, category: "salary" },
        { type: "expense", amount: 500, category: "food" },
        { type: "expense", amount: 1000, category: "housing" },
      ],
      previous: [
        { type: "income", amount: 4800, category: "salary" },
        { type: "expense", amount: 450, category: "food" },
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
