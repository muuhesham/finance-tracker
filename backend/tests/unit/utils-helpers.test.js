import { describe, expect, it } from "vitest";
import { roundCurrency } from "../../src/utils/roundCurrency.js";
import { resolveQuery } from "../../src/utils/resolveQuery.js";
import { buildMonthlyTrend } from "../../src/utils/buildMonthlyTrend.js";
import { summarizeTransactions } from "../../src/utils/summarizeTransactions.js";

describe("Utility Helpers", () => {
  describe("roundCurrency", () => {
    it("should round floating point numbers to two decimal places", () => {
      expect(roundCurrency(10.555)).toBe(10.55);
      expect(roundCurrency(10.5)).toBe(10.5);
      expect(roundCurrency(10.004)).toBe(10);
    });
  });

  describe("resolveQuery", () => {
    it("should call lean if lean is a function", () => {
      const mockQuery = {
        lean: () => "resolved-lean",
      };
      expect(resolveQuery(mockQuery)).toBe("resolved-lean");
    });

    it("should return the query itself if lean is not a function", () => {
      const mockQuery = { some: "data" };
      expect(resolveQuery(mockQuery)).toEqual({ some: "data" });
    });

    it("should handle null or undefined safely", () => {
      expect(resolveQuery(null)).toBeNull();
      expect(resolveQuery(undefined)).toBeUndefined();
    });
  });

  describe("summarizeTransactions", () => {
    it("should correctly summarize lists of income and expenses", () => {
      const transactions = [
        { type: "income", amount: 1000 },
        { type: "expense", amount: 200, category: "food" },
        { type: "expense", amount: 300, category: "transport" },
        { type: "expense", amount: 150, category: "food" },
      ];

      const summary = summarizeTransactions(transactions);

      expect(summary).toEqual({
        income: 1000,
        expense: 650,
        expenseByCategory: {
          food: 350,
          transport: 300,
        },
      });
    });
  });

  describe("buildMonthlyTrend", () => {
    it("should build monthly trend and sort chronologically", () => {
      const records = [
        { _id: { month: "2026-02", type: "income" }, totalAmount: 5000 },
        { _id: { month: "2026-02", type: "expense" }, totalAmount: 2000 },
        { _id: { month: "2026-01", type: "income" }, totalAmount: 4500 },
        { _id: { month: "2026-01", type: "expense" }, totalAmount: 1500 },
      ];

      const result = buildMonthlyTrend(records);

      expect(result).toEqual([
        { month: "2026-01", income: 4500, expense: 1500, label: "Jan 2026" },
        { month: "2026-02", income: 5000, expense: 2000, label: "Feb 2026" },
      ]);
    });
  });
});
