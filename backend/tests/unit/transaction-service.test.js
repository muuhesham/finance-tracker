import { describe, expect, it } from "vitest";
import { createTransactionService } from "../../src/services/TransactionService.js";

function createRepositoryStub() {
  const records = [];

  return {
    async create(payload) {
      const record = {
        _id: `txn-${records.length + 1}`,
        createdAt: new Date("2026-03-10T10:00:00.000Z"),
        ...payload,
      };
      records.push(record);
      return record;
    },
    async findOneAndUpdate(filter, updates) {
      const index = records.findIndex((record) => record._id === filter._id);
      if (index < 0) {
        return null;
      }

      records[index] = { ...records[index], ...updates };
      return records[index];
    },
    async findOneAndDelete(filter) {
      const index = records.findIndex((record) => record._id === filter._id);
      if (index < 0) {
        return null;
      }

      const [record] = records.splice(index, 1);
      return record;
    },
    find(filter) {
      return {
        sort() {
          return {
            limit() {
              return records.filter(
                (record) => record.userId === filter.userId,
              );
            },
          };
        },
      };
    },
  };
}

describe("TransactionService", () => {
  it("creates and returns normalized transactions", async () => {
    const repository = createRepositoryStub();
    const service = createTransactionService({ transactionModel: repository });

    const result = await service.create("user-1", {
      type: "expense",
      amount: 33.5,
      category: "food",
      note: "Lunch",
      transactionDate: "2026-03-10",
    });

    expect(result.id).toBe("txn-1");
    expect(result.category).toBe("food");
    expect(result.amount).toBe(33.5);
  });

  it("lists recent transactions for the dashboard", async () => {
    const repository = createRepositoryStub();
    const service = createTransactionService({ transactionModel: repository });

    await service.create("user-1", {
      type: "income",
      amount: 2000,
      category: "salary",
      note: "Salary",
      transactionDate: "2026-03-01",
    });

    const result = await service.listRecent("user-1");

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("income");
  });
});
