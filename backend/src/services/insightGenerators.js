export function foodSpendInsight({ currentSummary }) {
  const { expense, expenseByCategory } = currentSummary;
  const foodExpense = expenseByCategory.food ?? 0;
  const foodRatio = expense ? foodExpense / expense : 0;

  if (foodRatio < 0.35) return null;

  return {
    title: "Food spending is dominating your budget",
    message: `Food is ${Math.round(foodRatio * 100)}% of your expenses. Consider meal planning.`,
    severity: "warning",
  };
}

export function savingsRateInsight({ currentSummary }) {
  const { income, expense } = currentSummary;
  const savings = income - expense;

  if (!income) {
    return {
      title: "Track income",
      message: "Add income transactions for better insights.",
      severity: "info",
    };
  }

  const savingsRate = savings / income;

  if (savingsRate < 0.1) {
    return {
      title: "Savings rate is low",
      message: `You saved ${Math.max(0, Math.round(savingsRate * 100))}% this month.`,
      severity: "warning",
    };
  }

  return {
    title: "Healthy savings trend",
    message: `You kept ${Math.round(savingsRate * 100)}% of your income. Great job!`,
    severity: "success",
  };
}

export function transportIncreaseInsight({ currentSummary, previousSummary }) {
  const prev = previousSummary.expenseByCategory.transport ?? 0;
  const curr = currentSummary.expenseByCategory.transport ?? 0;

  if (!prev || curr <= prev) return null;

  const increase = ((curr - prev) / prev) * 100;

  if (increase < 15) return null;

  return {
    title: "Transport costs increased",
    message: `Transport is up ${Math.round(increase)}% vs last month.`,
    severity: "warning",
  };
}
