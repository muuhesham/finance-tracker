export function normalizeTransaction(transaction) {
  return {
    id: transaction._id.toString(),
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note,
    transactionDate: transaction.transactionDate,
  };
}

export function normalizeResult(transaction) {
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
