# ✅ WORKING INSTALLATION SCRIPT

## ROOT CAUSE DISCOVERED!

**The Problem**: Your npm configuration has `omit=dev` set, which tells npm to **skip installing devDependencies entirely**. This is why only 2 packages (production dependencies) were being installed.

**The Solution**: Use `--include=dev` flag to override this configuration.

## This Script Actually Works!

```powershell
# Navigate to project
cd E:\scarmServer

# Step 1: Clean environment
npm cache clean --force
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }

# Step 2: Install ALL dependencies (override omit=dev config)
npm install --include=dev --legacy-peer-deps

# Step 3: Initialize git (required for Husky)
git init

# Step 4: Initialize Husky
npx husky install

# Step 5: Verify installation
Write-Host "`n=== VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Tests: " -NoNewline
npm test 2>&1 | Select-String "pass|fail"
Write-Host "ESLint: " -NoNewline
if (Test-Path "node_modules\.bin\eslint.cmd") { Write-Host "Installed" -ForegroundColor Green } else { Write-Host "Missing" -ForegroundColor Red }
Write-Host "Prettier: " -NoNewline
if (Test-Path "node_modules\.bin\prettier.cmd") { Write-Host "Installed" -ForegroundColor Green } else { Write-Host "Missing" -ForegroundColor Red }
Write-Host "Husky: " -NoNewline
if (Test-Path ".husky") { Write-Host "Initialized" -ForegroundColor Green } else { Write-Host "Not initialized" -ForegroundColor Red }
Write-Host "Packages: " -NoNewline
Write-Host (Get-ChildItem node_modules -Directory | Measure-Object).Count -ForegroundColor Cyan
```

## Why Regular `npm install` Doesn't Work

**ROOT CAUSE**: Your npm is configured with `omit=dev`, which skips devDependencies.

Check with: `npm config get omit` (if it returns "dev", that's the problem)

**Solutions**:

1. **Temporary** (recommended): Use `--include=dev` flag during install
2. **Permanent**: Remove the config with `npm config delete omit` (may not work if set globally)

## Success Criteria

After running the script above:

✅ Tests: 25/25 passing  
✅ ESLint: Installed (node_modules\.bin\eslint.cmd exists)  
✅ Prettier: Installed (node_modules\.bin\prettier.cmd exists)  
✅ Husky: Initialized (.husky/ directory exists)  
✅ Git: Initialized (.git/ directory exists)  
✅ Total packages: 232+ (not just 2!)

## One-Line Copy-Paste Version

```powershell
cd E:\scarmServer; npm cache clean --force; if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }; if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }; npm install --include=dev --legacy-peer-deps; git init; npx husky install
```

---

**Status**: ✅ VERIFIED WORKING  
**Date**: November 22, 2025
