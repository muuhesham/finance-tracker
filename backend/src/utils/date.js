function pad(value) {
  return String(value).padStart(2, '0');
}

export function resolveMonthRange(monthValue) {
  const reference = monthValue ? new Date(`${monthValue}-01T00:00:00.000Z`) : new Date();
  const startDate = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1));
  const endDate = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1));
  const previousStartDate = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - 1, 1));
  const previousEndDate = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), 1));
  const monthKey = `${startDate.getUTCFullYear()}-${pad(startDate.getUTCMonth() + 1)}`;

  return {
    monthKey,
    startDate,
    endDate,
    previousStartDate,
    previousEndDate
  };
}

export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
