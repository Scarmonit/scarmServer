# scarmServer - Code Style Configuration

[![CI](https://img.shields.io/github/actions/workflow/status/scarmonit/scarmServer/ci.yml?branch=main)](./.github/workflows/ci.yml) [![Coverage](https://img.shields.io/badge/coverage-c8%20|%20thresholds-blue)](./coverage) [![Codecov](https://img.shields.io/badge/codecov-pending-lightgrey)](https://codecov.io/gh/scarmonit/scarmServer) [![Lint](https://img.shields.io/badge/lint-eslint-green)](eslint.config.js)

> Governance & Automation: See `.github/CODEOWNERS`, `.github/dependabot.yml`, issue templates in `.github/ISSUE_TEMPLATE/`, and PR template `.github/PULL_REQUEST_TEMPLATE.md`.

## Overview

This project uses a comprehensive code style configuration to ensure consistency across all code files. The configuration is enforced through multiple tools and IDE settings.

## Configuration Files

For a deeper explanation of the JetBrains configuration internals see `code_explanation.md`.

### JetBrains IDE Settings

- **`.idea/codeStyles/codeStyleConfig.xml`** - Enables per-project code style settings
- **`.idea/codeStyles/Project.xml`** - Custom project code style scheme

These files ensure that JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.) automatically apply the correct formatting rules.

### EditorConfig

- **`.editorconfig`** - Cross-editor configuration for basic formatting rules
- Works with JetBrains IDEs, VS Code, and most modern editors

### ESLint

- **`eslint.config.js`** - Modern flat config (replaces legacy `.eslintrc.json`)
- **`.eslintignore`** - Files to exclude from linting

### Prettier

- **`.prettierrc`** - Code formatting configuration
- **`.prettierignore`** - Files to exclude from formatting

## Code Style Standards

### General Rules

- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Maximum 100 characters
- **Quotes**: Single quotes for strings, backticks for templates
- **Semicolons**: Required
- **Line Endings**: LF (Unix-style)

### JavaScript/TypeScript

- **Module System**: ES Modules only (`import`/`export`, never `require`)
- **Async/Await**: Always use async/await instead of raw promises
- **Error Handling**: Comprehensive try-catch blocks required
- **Logging**: Use logger from `./utils/logger.js`, never `console.log`

### Naming Conventions

- **camelCase**: Functions, variables, methods
- **PascalCase**: Classes, constructors, components
- **UPPER_SNAKE_CASE**: Constants
- **kebab-case**: File names

## IDE Integration

### JetBrains IDEs (IntelliJ IDEA, WebStorm, PyCharm)

The code style is automatically applied when you:

- Format code (Ctrl+Alt+L / Cmd+Alt+L)
- Generate code
- Use auto-completion
- Organize imports

### VS Code

Install the following extensions for full support:

- EditorConfig for VS Code
- ESLint
- Prettier - Code formatter

### Other Editors

Most modern editors support EditorConfig out of the box or via plugins.

## ✨ Features

- ✅ **Automatic Code Formatting** - JetBrains IDE, ESLint, Prettier integration
- ✅ **Comprehensive Testing** - Node.js test runner with 25 passing tests
- ✅ **Smart Logging** - Structured logging utility (no console.log)
- ✅ **Input Validation** - Built-in validation helpers
- ✅ **A2A Protocol** - Agent-to-Agent communication framework
- ✅ **LLM Clients** - Extensible LLM API client base
- ✅ **Environment Config** - Secure configuration management
- ✅ **ES Modules** - Modern JavaScript module system

## 📊 Test Coverage

Thresholds enforced (fail CI if below):

- Lines ≥ 80%
- Statements ≥ 80%
- Functions ≥ 70%
- Branches ≥ 60%

```
✔ 25 tests passing
✔ 12 test suites
✔ 0 failures
```

Test areas:

- Logger utility (3 tests)
- Validation helpers (16 tests)
- Configuration constants (6 tests)

## Usage

### NPM Scripts

```bash
# Development
npm run start:dev          # Start with auto-reload
npm run start:bridge       # Start A2A Bridge
npm run system:start       # Start all components

# Testing
npm test                   # Run tests
npm run test:coverage      # Run tests with coverage
npm run coverage:threshold # Check coverage thresholds

# Code Quality
npm run lint               # Check linting
npm run lint:fix           # Fix linting issues
npm run format             # Format all files
npm run format:check       # Check formatting

# Git Hooks (auto-configured via husky)
# - Pre-commit: lint-staged (format & lint changed files)
# - Commit-msg: commitlint (enforce conventional commits)
```

### Format Code

```bash
# Format all files (requires prettier)
npx prettier --write .

# Lint all files
npx eslint .

# Fix auto-fixable linting issues
npx eslint --fix .
```

### Pre-commit Checks

Before committing code, ensure:

- [ ] All tests pass
- [ ] Linting is clean
- [ ] No `console.log` statements
- [ ] Error handling is present
- [ ] Documentation is updated

## Project Structure (LLM Framework)

```
scarmServer/
├── src/
│   ├── agents/          # A2A agents
│   ├── clients/         # LLM clients
│   ├── config/          # Constants and configuration
│   └── utils/           # Shared utilities
├── tests/               # Node.js test runner tests
└── scripts/             # Automation scripts
```

## Anti-Patterns to Avoid

1. ❌ Synchronous file operations (use `fs.promises`)
2. ❌ Unhandled promise rejections
3. ❌ Monolithic functions (break into smaller units)
4. ❌ Missing input validation
5. ❌ Hardcoded configuration
6. ❌ `console.log` for debugging (use logger)
7. ❌ `require()` syntax (use `import`/`export`)

## Git Configuration

**Author**: Parker Dunn  
**Email**: Scarmonit@gmail.com

## Version Control

All configuration files in this directory are tracked in version control to ensure consistency across the development team. The `.idea/codeStyles/` directory is shared to maintain uniform code formatting.

---

Last Updated: November 22, 2025

## Deployment

### Docker (GHCR)

Images are published to GitHub Container Registry via `deploy.yml` on pushes to `main`.

**Quick Start:**

```powershell
# Pull and run latest
docker run -p 3000:3000 ghcr.io/scarmonit/scarmserver:latest

# Health check
curl http://localhost:3000/health
```

**For private repos:**

```powershell
echo $env:GITHUB_TOKEN | docker login ghcr.io -u scarmonit --password-stdin
docker run -p 3000:3000 ghcr.io/scarmonit/scarmserver:latest
```

### Docker Compose

```powershell
docker compose up -d
```

### Local Node

```powershell
npm start
# Open http://localhost:3000/health
```

### Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for:

- CI/CD pipeline details
- Production deployment guide
- Environment variables
- Health checks & monitoring
- Troubleshooting
- Kubernetes examples

## Local LLM Integration (No External API Limits)

This project now supports running completions against a local LLM server (e.g., [Ollama](https://ollama.ai)).

### Configuration Environment Variables

```
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2
MODEL_MAX_TOKENS=512
MODEL_TEMPERATURE=0.7
```

### Usage Example

```javascript
import { LocalLLMClient } from './src/clients/local-llm-client.js';
const client = new LocalLLMClient();
const output = await client.complete('Explain event loops in Node.js in one paragraph.');
console.log(output);

for await (const chunk of client.stream('Write a haiku about code.')) {
  process.stdout.write(chunk);
}
```

### Benefits

- No external rate limits
- Data stays local
- Lower latency for iterative development
- Can stream tokens for realtime interaction

### Starting Ollama (Example)

```bash
ollama pull llama2
ollama serve
```

Make sure the host and model match your local setup.

### High-Level Service Wrapper

A higher-level `LLMService` is available for caching, validation, and unified streaming interface.

```javascript
import { LLMService } from './src/services/llm-service.js';
const service = new LLMService();
const text = await service.generate('Summarize the benefits of local LLMs.');
console.log(text);

for await (const token of await service.generate('Stream a short poem.', { stream: true })) {
  process.stdout.write(token);
}
```

## A2A Bridge Agent Protocol (WebSocket)

Connect to: `ws://localhost:<PORT+1>` (default 3001 if PORT=3000)

Request message format:
```json
{ "id": "req-1", "type": "llm.generate", "prompt": "Hello" }
```
Streaming request:
```json
{ "id": "stream-1", "type": "llm.stream", "prompt": "Write a short poem" }
```
Responses:
- Generate: `{ "id": "req-1", "data": "<full output string>" }`
- Stream chunks: `{ "id": "stream-1", "chunk": "token" }` ... final `{ "id": "stream-1", "done": true }`
Errors:
```json
{ "id": "req-1", "error": "message" }
```
