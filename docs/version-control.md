# Version Control and Collaboration Workflow

## Branching Strategy

- `main`: production-ready branch
- `develop`: integration branch
- `feature/<feature-name>`: new features
- `fix/<issue-name>`: bug fixes
- `docs/<topic>`: documentation improvements

## Pull Request Structure

Each pull request should contain:

- Summary of business goal
- Scope of changed modules
- Screenshots for UI changes
- API contract impact
- Test evidence
- Risks or follow-up items

## Suggested Workflow

1. Create a feature branch from `develop`.
2. Implement changes with small, focused commits.
3. Run tests and build validation locally.
4. Open a pull request into `develop`.
5. Complete code review.
6. Merge to `develop`, then promote to `main`.

## Commit Guidelines

- `feat: add monthly insight strategies`
- `fix: secure transaction update ownership`
- `docs: add architecture and uml package`
- `test: cover dashboard insight service rules`
