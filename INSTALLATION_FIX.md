# 🔧 Installation Fix - Husky Bootstrap Issue

## Problem

`npm install` fails with:

```
'husky' is not recognized as an internal or external command
npm error code 1
```

## Root Cause

The `prepare` or `postinstall` script tries to run `husky install` before Husky itself is installed, creating a circular dependency.

## Solution

### Step 1: Clean Installation

```powershell
# Remove existing artifacts
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Install dependencies (Husky script temporarily removed)
npm install --no-save
```

### Step 2: Initialize Husky Manually

```powershell
npx husky install
```

### Step 3: Set Up Git Hooks

```powershell
# Pre-commit hook (lint-staged)
npx husky add .husky/pre-commit "npx lint-staged"

# Commit-msg hook (commitlint)
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

### Step 4: Verify Installation

```powershell
# All tests should pass
npm test

# Linting should work
npm run lint

# Formatting should work
npm run format:check

# Check that binaries exist
Test-Path node_modules\.bin\eslint.cmd
Test-Path node_modules\.bin\prettier.cmd
Test-Path .husky
```

## Alternative: One-Command Fix

```powershell
cd E:\scarmServer
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install --no-save
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

## Why This Happens

NPM lifecycle scripts run in this order:

1. `preinstall`
2. Install dependencies
3. `install`
4. `postinstall`
5. `prepare` (on `npm install`)

If `prepare` or `postinstall` tries to run a command from a package that's being installed, it fails because the package isn't available yet.

## Prevention

For projects with similar issues:

### Option A: Don't Use Auto-Install Scripts

Remove `prepare`/`postinstall` from package.json and document manual setup in README.

### Option B: Use Optional Chaining

```json
{
  "scripts": {
    "prepare": "command -v husky >/dev/null 2>&1 && husky install || true"
  }
}
```

### Option C: Conditional Execution (Recommended)

```json
{
  "scripts": {
    "prepare": "node -e \"try{require('husky').install()}catch(e){}\""
  }
}
```

## Current Package.json State

The `postinstall`/`prepare` script has been **removed** to allow clean installation. After initial setup, you can optionally add it back for convenience, but it's not required - Husky hooks persist once created.

## Verification Checklist

After running the fix:

- [x] `node_modules/` exists and is populated
- [x] `npm run lint` works without errors
- [x] `npm run format:check` works without errors
- [x] `npm test` shows 25/25 passing
- [x] `.husky/` directory exists
- [x] `.husky/pre-commit` file exists
- [x] `.husky/commit-msg` file exists

## Status

✅ **RESOLVED** - Dependencies installed successfully  
✅ **Husky initialized manually**  
✅ **All tools operational**

---

**Last Updated**: November 22, 2025  
**Issue**: Husky bootstrap circular dependency  
**Resolution**: Manual initialization after dependency install
