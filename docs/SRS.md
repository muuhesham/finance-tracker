# Software Requirements Specification

## 1. Purpose

FinanceFlow enables users to record income and expenses, categorize transactions, observe monthly financial trends, and receive automated spending insights and saving recommendations.

## 2. Functional Requirements

### Authentication

- The system shall allow new users to register with name, email, and password.
- The system shall allow existing users to log in with email and password.
- The system shall protect private routes using JWT-based authentication.
- The system shall return the authenticated user profile.

### Transaction Management

- The system shall allow users to create income or expense transactions.
- The system shall allow users to edit existing transactions.
- The system shall allow users to delete transactions.
- The system shall store amount, type, category, note, and transaction timestamp for each record.
- The system shall display recent transactions in reverse chronological order.

### Dashboard

- The system shall show monthly total income.
- The system shall show monthly total expenses.
- The system shall show monthly balance.
- The system shall show expense distribution by category.
- The system shall show monthly income and expense trends for the latest six months.
- The system shall allow month selection for dashboard focus.

### Insights Engine

- The system shall analyze current and previous monthly transaction behavior.
- The system shall generate rule-based financial advice.
- The system shall identify category concentration risks such as food overspending.
- The system shall detect cost increases such as transport spikes.
- The system shall assess savings rate and provide improvement suggestions.

## 3. Non-Functional Requirements

- The system shall use RESTful APIs.
- The system shall follow SOLID and clean code practices.
- The UI shall be responsive and mobile-friendly.
- Passwords shall be hashed securely.
- The system shall validate input on the backend.
- The system shall support maintainable extension of insight rules.
- The system shall be ready for deployment with environment-based configuration.

## 4. Actors

- End User
- System Administrator or Developer

## 5. Use Cases

- Register account
- Log in
- Record expense
- Record income
- Update transaction
- Delete transaction
- Review monthly dashboard
- Review automated monthly insights

## 6. Assumptions

- Each user manages only their own transactions.
- Currency formatting is presented in USD in the UI, while the backend stores numeric values only.
- MongoDB is available in the runtime environment.
