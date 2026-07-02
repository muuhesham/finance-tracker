import { describe, expect, it } from "vitest";
import { normalizeTransaction, normalizeResult } from "../../src/resources/transaction.js";

describe("Transaction Resources", () => {
  const mockTransaction = {
    _id: { toString: () => "txn-123" },
    type: "expense",
    amount: 120.5,
    category: "food",
    note: "Groceries",
    transactionDate: new Date("2026-03-01"),
    createdAt: new Date("2026-03-01T12:00:00.000Z"),
  };

  it("should normalize a transaction correctly with normalizeTransaction", () => {
    const result = normalizeTransaction(mockTransaction);
    expect(result).toEqual({
      id: "txn-123",
      type: "expense",
      amount: 120.5,
      category: "food",
      note: "Groceries",
      transactionDate: mockTransaction.transactionDate,
    });
    expect(result.createdAt).toBeUndefined();
  });

  it("should normalize a transaction correctly with normalizeResult", () => {
    const result = normalizeResult(mockTransaction);
    expect(result).toEqual({
      id: "txn-123",
      type: "expense",
      amount: 120.5,
      category: "food",
      note: "Groceries",
      transactionDate: mockTransaction.transactionDate,
      createdAt: mockTransaction.createdAt,
    });
  });
});
