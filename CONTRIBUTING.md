# Contributing to scarmServer

Thank you for considering contributing to scarmServer! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)
- JetBrains IDE (IntelliJ IDEA, WebStorm, etc.) or VS Code

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd scarmServer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run tests**

   ```bash
   npm test
   ```

5. **Start development**
   ```bash
   npm run start:dev
   ```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, well-documented code
- Follow the project's code style (enforced by IDE settings)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint your code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 4. Commit Your Changes

Follow the commit message format (see below).

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on the repository.

## Code Style

### Automatic Formatting

The project uses automatic code formatting enforced by:

- JetBrains IDE code style settings
- ESLint
- Prettier
- EditorConfig

**Format code before committing:**

```bash
npm run format
npm run lint:fix
```

### Key Standards

#### General

- **Indentation**: 2 spaces (no tabs)
- **Line Length**: 100 characters max
- **Quotes**: Single quotes (`'`), backticks for templates
- **Semicolons**: Always required
- **Line Endings**: LF (Unix-style)

#### JavaScript/TypeScript

```javascript
// ✓ Good
import { info } from './utils/logger.js';

const myFunction = async (param1, param2) => {
  try {
    info('Processing request', { param1, param2 });
    const result = await someAsyncOperation(param1);
    return result;
  } catch (error) {
    error('Operation failed', error);
    throw error;
  }
};

// ✗ Bad
const myFunction = async (param1, param2) => {
  console.log('Processing request'); // No semicolon, double quotes, console.log
  let result = await someAsyncOperation(param1); // No spacing
  return result;
};
```

#### Naming Conventions

- **camelCase**: functions, variables, methods

  ```javascript
  const userName = 'John';
  function getUserData() {}
  ```

- **PascalCase**: classes, constructors

  ```javascript
  class UserManager {}
  class HttpClient {}
  ```

- **UPPER_SNAKE_CASE**: constants

  ```javascript
  const MAX_RETRY_COUNT = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

- **kebab-case**: file names
  ```
  user-manager.js
  http-client.js
  validation-helpers.js
  ```

### Anti-Patterns to Avoid

❌ **Don't use `console.log`**

```javascript
// ✗ Bad
console.log('Debug message');

// ✓ Good
import { info } from '../utils/logger.js';
info('Debug message');
```

❌ **Don't use `require()`**

```javascript
// ✗ Bad
const logger = require('./utils/logger');

// ✓ Good
import logger from './utils/logger.js';
```

❌ **Don't hardcode values**

```javascript
// ✗ Bad
const port = 3000;

// ✓ Good
import { CONFIG } from './config/constants.js';
const port = CONFIG.PORT;
```

❌ **Don't use synchronous operations**

```javascript
// ✗ Bad
const data = fs.readFileSync('file.txt');

// ✓ Good
import { readFile } from 'fs/promises';
const data = await readFile('file.txt', 'utf-8');
```

## Testing

### Test Requirements

- **Coverage**: Aim for 90%+ on business logic
- **Framework**: Node.js native test runner (`node:test`)
- **Assertions**: `node:assert/strict`

### Writing Tests

```javascript
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';

describe('MyModule', () => {
  before(() => {
    // Setup
  });

  after(() => {
    // Cleanup
  });

  it('should do something correctly', async () => {
    const result = await myFunction();
    assert.strictEqual(result, expectedValue);
  });

  it('should handle errors gracefully', async () => {
    await assert.rejects(async () => await myFunction(invalidInput), { name: 'ValidationError' });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node --test tests/utils/logger.test.js

# Run with coverage
npm run test:coverage
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples

```
feat(logger): add debug level support

Add support for debug level logging with configurable
visibility based on LOG_LEVEL environment variable.

Closes #123
```

```
fix(validation): handle null values correctly

Previously validateRequired would not catch null values.
This commit ensures null is treated as missing value.

Fixes #456
```

```
docs(readme): update installation instructions

Add details about Node.js version requirement and
environment setup steps.
```

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**

   ```bash
   npm test
   ```

2. **Fix linting issues**

   ```bash
   npm run lint:fix
   ```

3. **Format code**

   ```bash
   npm run format
   ```

4. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments for public APIs
   - Update relevant guides

5. **Check coverage**
   ```bash
   npm run test:coverage
   ```

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No `console.log` statements
- [ ] No hardcoded configuration values
- [ ] Error handling implemented
- [ ] JSDoc comments added for public APIs

### PR Description Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe the tests you ran and how to reproduce.

## Checklist

- [ ] All tests pass
- [ ] Linting clean
- [ ] Documentation updated
- [ ] No console.log statements
```

### Review Process

1. Submit your PR
2. Wait for automated checks to pass
3. Address review feedback
4. Get approval from maintainer(s)
5. PR will be merged

## Questions?

If you have questions:

- Check existing documentation
- Review closed issues
- Ask in PR comments
- Contact maintainers

---

**Thank you for contributing to scarmServer!** 🚀
