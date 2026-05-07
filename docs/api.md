# API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

### `POST /auth/register`

Request:

```json
{
  "name": "Omar Hassan",
  "email": "omar@example.com",
  "password": "StrongPass123"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "Omar Hassan",
    "email": "omar@example.com"
  }
}
```

### `POST /auth/login`

Request:

```json
{
  "email": "omar@example.com",
  "password": "StrongPass123"
}
```

### `GET /auth/profile`

Headers:

```text
Authorization: Bearer <token>
```

## Transactions

### `GET /transactions`

Returns recent transactions for the authenticated user.

### `POST /transactions`

Request:

```json
{
  "type": "expense",
  "amount": 42.5,
  "category": "food",
  "note": "Lunch with team",
  "transactionDate": "2026-04-19"
}
```

### `PUT /transactions/:id`

Same request body as create.

### `DELETE /transactions/:id`

Returns `204 No Content` when deletion succeeds.

## Dashboard

### `GET /dashboard/summary?month=2026-04`

Response:

```json
{
  "month": "2026-04",
  "monthLabel": "Apr 2026",
  "totals": {
    "income": 4200,
    "expense": 2650,
    "balance": 1550
  },
  "categoryBreakdown": [
    {
      "category": "food",
      "amount": 630
    }
  ],
  "recentTransactions": [],
  "monthlyTrend": []
}
```

## Insights

### `GET /insights/monthly?month=2026-04`

Response:

```json
{
  "month": "2026-04",
  "insights": [
    {
      "title": "Transport costs increased",
      "message": "Transport spending increased by 20% compared with last month.",
      "severity": "warning"
    }
  ]
}
```

## Status Codes

- `200` Success
- `201` Resource created
- `204` Resource deleted
- `400` Validation error
- `401` Unauthorized
- `404` Resource not found
- `409` Conflict
- `500` Internal server error
