export function foodSpendInsight({ currentSummary }) {
  const totalExpense = currentSummary.expense;
  const foodExpense = currentSummary.expenseByCategory.food ?? 0;

  if (!totalExpense || foodExpense / totalExpense < 0.35) {
    return null;
  }

  return {
    title: "Food spending is dominating your budget",
    message: `Food represents ${Math.round((foodExpense / totalExpense) * 100)}% of this month's expenses. Consider meal planning or setting a weekly dining cap.`,
    severity: "warning",
  };
}

export function savingsRateInsight({ currentSummary }) {
  const income = currentSummary.income;
  const balance = currentSummary.income - currentSummary.expense;

  if (!income) {
    return {
      title: "Track income sources for better insight quality",
      message:
        "Add income transactions to unlock more accurate savings recommendations and trend comparisons.",
      severity: "info",
    };
  }

  const savingsRate = balance / income;

  if (savingsRate < 0.1) {
    return {
      title: "Savings rate is below your target",
      message: `You saved ${Math.max(0, Math.round(savingsRate * 100))}% of income this month. Try automating a transfer right after payday to protect savings first.`,
      severity: "warning",
    };
  }

  return {
    title: "Savings trend is healthy",
    message: `You kept ${Math.round(savingsRate * 100)}% of income after expenses. Keeping this pace supports a stronger emergency fund.`,
    severity: "success",
  };
}

export function transportIncreaseInsight({ currentSummary, previousSummary }) {
  const previousTransport = previousSummary.expenseByCategory.transport ?? 0;
  const currentTransport = currentSummary.expenseByCategory.transport ?? 0;

  if (!previousTransport || currentTransport <= previousTransport) {
    return null;
  }

  const increase =
    ((currentTransport - previousTransport) / previousTransport) * 100;

  if (increase < 15) {
    return null;
  }

  return {
    title: "Transport costs increased",
    message: `Transport spending increased by ${Math.round(increase)}% compared with last month. Reviewing ride frequency or fuel use could help recover budget.`,
    severity: "warning",
  };
}
