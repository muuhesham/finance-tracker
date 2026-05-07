# Detailed Implementation Explanation

## SOLID Principles

### Single Responsibility Principle

- Controllers only handle HTTP request and response concerns.
- Services contain business rules.
- Repositories focus only on data persistence.
- Insight strategies each implement one financial rule.

### Open/Closed Principle

- New insight rules can be added by creating a new strategy class and registering it in the service factory.
- Existing services do not need modification for every new insight rule.

### Liskov Substitution Principle

- Repository implementations can replace repository contracts without changing service behavior.
- Insight strategies follow the same contract and are safely interchangeable.

### Interface Segregation Principle

- Repository contracts are focused by responsibility: user, transaction, and insight persistence are separated.
- Consumers only depend on the repository operations they actually need.

### Dependency Inversion Principle

- Services depend on repository abstractions, not direct MongoDB code.
- `ServiceFactory` injects concrete implementations at composition time.

## Design Patterns

### Repository Pattern

- Used to separate persistence logic from business logic.
- Implemented with repository contracts in `domain/repositories` and Mongo implementations in `repositories`.

### Strategy Pattern

- Used in the insights engine to encapsulate rule-based financial advice.
- Implemented through `FoodSpendInsightStrategy`, `TransportIncreaseInsightStrategy`, and `SavingsRateInsightStrategy`.

### Factory Pattern

- Used to centralize application dependency construction.
- Implemented in `ServiceFactory`, which creates repositories, strategies, and services.

## Agile Process Execution

The project simulates four Scrum sprints:

- Sprint 1: requirements, architecture, authentication, project setup
- Sprint 2: transaction management and secure API
- Sprint 3: dashboard analytics, charting, and responsive UX
- Sprint 4: insights engine, tests, and final documentation

The detailed sprint artifacts are documented in [docs/agile/scrum-plan.md](/C:/Users/Omar/Documents/Codex/2026-04-19-you-are-a-senior-full-stack/docs/agile/scrum-plan.md).

## Architecture Decisions

- MongoDB was chosen because the project requirement preferred it and the document structure fits transaction records well.
- Express was chosen for clear RESTful routing and a lightweight service-oriented backend.
- React with Vite was chosen for fast UI delivery and a clean component structure.
- Axios centralizes API configuration and auth header injection.

## How the Insights System Works

1. The user opens the dashboard for a given month.
2. The frontend requests `/dashboard/summary` and `/insights/monthly`.
3. `InsightService` loads current and previous month transactions.
4. Each registered strategy evaluates the summary data.
5. Matching strategies return insight objects with title, message, and severity.
6. The monthly insight set is cached in MongoDB for future requests.

## Challenges and Solutions

### Challenge: Keep business logic clean and extensible

Solution:
Separate controllers, services, repositories, and strategies so responsibilities stay narrow and changes remain low-risk.

### Challenge: Support environments without a global package manager

Solution:
Use npm for package management and document the simplified project setup in the README.

### Challenge: Provide meaningful UI without overcomplicating the codebase

Solution:
Use a focused component set, strong layout primitives, reusable cards, and lightweight animation via Framer Motion.
