import { formatMonthLabel } from "./date.js";
import { roundCurrency } from "./roundCurrency.js";

export function buildMonthlyTrend(records) {
  const monthlyMap = new Map();

  for (const record of records) {
    const month = record._id.month;
    const current = monthlyMap.get(month) ?? { month, income: 0, expense: 0 };
    current[record._id.type] = roundCurrency(record.totalAmount);
    monthlyMap.set(month, current);
  }

  return [...monthlyMap.values()]
    .sort((left, right) => left.month.localeCompare(right.month))
    .map((item) => ({
      ...item,
      label: formatMonthLabel(item.month),
    }));
}
