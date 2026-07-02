export function summarizeTransactions(transactions) {
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
