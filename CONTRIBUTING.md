# Contributing to mycash-js

Thanks for your interest in contributing! This is a community open-source project.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/my-feature`

## Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Preview docs
npm run docs:dev
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Version bump |
| --- | --- | --- |
| `feat` | A new feature | Minor (`0.1.0` → `0.2.0`) |
| `fix` | A bug fix | Patch (`0.1.0` → `0.1.1`) |
| `docs` | Documentation only changes | None |
| `style` | Code style changes (formatting, etc.) | None |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None |
| `test` | Adding or updating tests | None |
| `chore` | Build process, CI, or tooling changes | None |
| `perf` | Performance improvement | Patch |

### Breaking changes

Add a `!` after the type/scope or include `BREAKING CHANGE:` in the footer to trigger a major version bump:

```
feat(api)!: change paymentRequest response shape

BREAKING CHANGE: requestId is now nested under payment.id
```

### Examples

```
feat(client): add retry logic for network errors
fix(utils): handle empty narration string
docs: update error handling examples
chore(release): 1.2.3 [skip ci]
```

## Releases

Releases are fully automated. When commits are pushed to `main`, [semantic-release](https://github.com/semantic-release/semantic-release) analyzes the commit messages and:

1. Determines the next version number
2. Updates `package.json` and `CHANGELOG.md`
3. Publishes to npm
4. Creates a GitHub Release with release notes

**You never manually bump versions or publish.** Just use conventional commit messages and merge to `main`.

## Pull Requests

- Use conventional commit messages in your PR
- Add tests for new features
- Update documentation if needed
- Ensure all checks pass (`npm test`, `npm run typecheck`, `npm run lint`)
- Keep PRs focused — one feature or fix per PR

## Code Style

- Use TypeScript strictly — no `any` types
- Follow the existing code conventions
- Use `camelCase` for public API, `snake_case` for wire format

## Reporting Issues

Use [GitHub Issues](https://github.com/taiatiniyara/mycash-js/issues). Include:

- Steps to reproduce
- Expected vs actual behavior
- Node.js version and OS
- Relevant error messages

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
