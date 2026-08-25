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

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Preview docs
npm run docs:dev
```

## Pull Requests

- Write clear commit messages
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
