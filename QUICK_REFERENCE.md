# scarmServer - Quick Reference Card

## 📦 Installation

```bash
npm install
cp .env.example .env
```

## 🎯 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm run start:dev` | Start with auto-reload |
| `npm run start:bridge` | Start A2A Bridge |
| `npm run system:start` | Start all components |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style issues |
| `npm run format` | Format all files |
| `npm run format:check` | Check formatting |

## 🎨 Code Style

### Formatting Rules
```javascript
// Indentation: 2 spaces
const example = {
  key: 'value',
};

// Quotes: Single quotes
const message = 'Hello, world!';

// Semicolons: Required
const result = calculate();

// Line length: 100 chars max
const longLine = 'This is a very long line that should be wrapped...';

// Template literals: Backticks
const greeting = `Hello, ${name}!`;
```

### Naming Conventions
```javascript
// camelCase: variables, functions
const userName = 'John';
function getUserData() { }

// PascalCase: classes
class UserManager { }

// UPPER_SNAKE_CASE: constants
const MAX_RETRIES = 3;

// kebab-case: files
// user-manager.js
// http-client.js
```

## 📝 Logging

```javascript
import { info, warn, error, debug } from './utils/logger.js';

// Info logging
info('Server started', { port: 3000 });

// Warning
warn('High memory usage', { usage: '85%' });

// Error (with Error object)
try {
  // ...
} catch (err) {
  error('Operation failed', err);
}

// Debug
debug('Processing request', { requestId: '123' });
```

**Never use `console.log`!**

## ✅ Validation

```javascript
import {
  validateRequired,
  validateLength,
  validateEmail,
  validateRequiredFields,
} from './utils/validation.js';

// Required field
validateRequired(value, 'username');

// Length check
validateLength(value, 3, 50, 'username');

// Email format
validateEmail(email, 'email');

// Required fields in object
validateRequiredFields(user, ['name', 'email', 'age']);
```

## ⚙️ Configuration

```javascript
import { CONFIG, HTTP_STATUS, ERROR_CODES } from './config/constants.js';

// Access config values
const port = CONFIG.PORT;
const env = CONFIG.NODE_ENV;

// HTTP status codes
res.status(HTTP_STATUS.OK).json(data);

// Error codes
throw new Error(ERROR_CODES.VALIDATION_ERROR);
```

**Never hardcode values!**

## 🧪 Testing

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

  it('should work correctly', async () => {
    const result = await myFunction();
    assert.strictEqual(result, expected);
  });

  it('should handle errors', async () => {
    await assert.rejects(
      async () => await myFunction(invalid),
      { name: 'ValidationError' }
    );
  });
});
```

## 🔄 Async/Await

```javascript
// ✓ Good
const processData = async (data) => {
  try {
    const validated = await validate(data);
    const result = await save(validated);
    return result;
  } catch (err) {
    error('Processing failed', err);
    throw err;
  }
};

// ✗ Bad
const processData = (data) => {
  validate(data).then((validated) => {
    save(validated).then((result) => {
      return result;
    });
  }).catch((err) => {
    console.log(err);
  });
};
```

## 📦 Module Imports

```javascript
// ✓ Good - ES Modules
import express from 'express';
import { info } from './utils/logger.js';

// ✗ Bad - CommonJS
const express = require('express');
const logger = require('./utils/logger');
```

**Always use ES Modules!**

## 🔐 Environment Variables

```bash
# .env file
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
API_KEY=your_key_here
```

```javascript
// Access in code
import { CONFIG } from './config/constants.js';
const port = CONFIG.PORT;
```

## 📋 Pre-Commit Checklist

- [ ] All tests pass (`npm test`)
- [ ] Linting clean (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No `console.log` statements
- [ ] No hardcoded values
- [ ] Error handling present
- [ ] JSDoc comments added
- [ ] Documentation updated

## 🚫 Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `console.log('message')` | `info('message')` |
| `require('./module')` | `import module from './module.js'` |
| `const port = 3000` | `const port = CONFIG.PORT` |
| `fs.readFileSync('file')` | `await readFile('file')` |
| `promise.then().catch()` | `await promise` in try-catch |

## 🔄 Git Workflow

```bash
# 1. Create branch
git checkout -b feature/my-feature

# 2. Make changes and test
npm test
npm run lint:fix
npm run format

# 3. Commit with convention
git commit -m "feat(module): add new feature"

# 4. Push and create PR
git push origin feature/my-feature
```

## 📞 Need Help?

- 📖 [Full Documentation](PROJECT_SETUP.md)
- 🎨 [Code Style Guide](CODE_STYLE_GUIDE.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)
- 📧 Contact: Scarmonit@gmail.com

---

**Version**: 1.0.0  
**Last Updated**: November 22, 2025  
**Maintained by**: Parker Dunn

