# Test Cases Document

## Automated Unit Tests

### Insight Service

- Verify that food overspending generates a warning insight.
- Verify that transport month-over-month increases generate a warning insight.
- Verify that savings rate health generates an appropriate recommendation.
- Verify that stable spending generates a fallback success message.

### Transaction Service

- Verify that a transaction is normalized after creation.
- Verify that recent transactions are returned for dashboard usage.

## Manual Test Cases

### Authentication

1. Register with valid credentials.
2. Log in with valid credentials.
3. Attempt login with an incorrect password.
4. Attempt access to dashboard APIs without a token.

### Transaction Management

1. Add a new expense and verify it appears in recent transactions.
2. Add a new income and verify monthly totals update.
3. Edit an existing transaction and verify charts recalculate.
4. Delete a transaction and verify it disappears from the list.

### Dashboard and Insights

1. Load dashboard for current month and confirm totals, chart data, and recent items render.
2. Switch month using the month picker and confirm dashboard data updates.
3. Create spending behavior that triggers rule-based warnings and verify insights render.
4. Create a balanced month and verify stable insights render.

## Validation Commands

```powershell
npm run test:api
npm run build:web
```
