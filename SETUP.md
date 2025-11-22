# 🚀 Quick Setup Instructions

## Initial Setup

1. **Install Dependencies**
   ```bash
   cd E:\scarmServer
   npm install
   ```
   
   This installs:
   - ESLint (code linting)
   - Prettier (code formatting)
   - c8 (coverage tool)
   - Husky (git hooks) - auto-initialized via postinstall
   - Commitlint (commit message validation)
   - Lint-staged (pre-commit automation)
   
   **Note**: Husky hooks are automatically set up during installation via the `postinstall` script.

2. **Run Tests**
   ```bash
   npm test
   ```
   
   Expected: 25/25 tests passing ✓

3. **Verify Code Quality**
   ```bash
   npm run lint
   npm run format:check
   ```
   
   Both should complete without errors.

## Common Commands

```bash
# Development
npm start                  # Run server
npm run start:dev          # Run with auto-reload

# Testing
npm test                   # Run all tests
npm run test:coverage      # Run with coverage + thresholds

# Code Quality
npm run lint               # Check linting
npm run lint:fix           # Fix linting issues
npm run format             # Format all files
npm run format:check       # Check formatting (CI)
```

## Troubleshooting

### "eslint is not recognized" / "prettier is not recognized"
**Cause**: Dependencies not installed  
**Fix**: Run `npm install`

### Tests pass but lint/format fail
**Cause**: node_modules missing or incomplete  
**Fix**: Delete `node_modules` and run `npm install`

### Git hooks not working
**Cause**: Husky not initialized  
**Fix**: Run `npm run prepare`

## Verification Checklist

After setup, verify:

- [ ] `npm test` - 25/25 passing
- [ ] `npm run lint` - No errors
- [ ] `npm run format:check` - Compliant
- [ ] `.husky/` directory exists
- [ ] `node_modules/` directory populated

## Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings (API keys, etc.)

## IDE Setup

### JetBrains (IntelliJ IDEA, WebStorm)
- Code style is **automatically** applied from `.idea/codeStyles/`
- No additional setup needed!

### VS Code
Install extensions:
- EditorConfig for VS Code
- ESLint
- Prettier - Code formatter

## Next Steps

1. Review [README.md](README.md) for project overview
2. Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
3. See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for daily commands

---

**Ready to code!** 🎉
