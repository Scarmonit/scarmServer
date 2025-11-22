# Code Style Export

This export consolidates all style-related configuration for use in other editors, CI environments, or downstream repos.

## Summary

| Concern        | Value / Rule                                      | Source File(s)                     |
| -------------- | -------------------------------------------------- | ---------------------------------- |
| Indentation    | 2 spaces                                           | .editorconfig, Project.xml, ESLint |
| Line length    | 100 characters                                     | .editorconfig, ESLint, Prettier    |
| Quotes         | Single (template literals allowed)                 | ESLint, Prettier, Project.xml      |
| Semicolons     | Required                                           | ESLint, Project.xml, Prettier      |
| Trailing comma | always-multiline / all                             | ESLint (always-multiline), Prettier|
| Imports/object | Spaces inside braces                               | ESLint object-curly-spacing, Project.xml |
| Module system  | ES Modules only                                    | README.md, ESLint (sourceType)     |
| Line endings   | LF                                                 | .editorconfig, Prettier            |
| Logger usage   | Use logger utility (no console.log)                | README.md                          |
| Max width wrap | Wrap beyond 100 columns                            | Project.xml, Prettier              |

## VS Code Settings
Add or merge `.vscode/settings.json`:

```jsonc
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.formatOnSave": true,
  "editor.wordWrapColumn": 100,
  "editor.wordWrap": "off",
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.options": {
    "ignorePath": ".eslintignore"
  },
  "prettier.singleQuote": true,
  "prettier.semi": true,
  "prettier.tabWidth": 2,
  "prettier.printWidth": 100,
  "prettier.trailingComma": "all",
  "prettier.bracketSpacing": true,
  "prettier.bracketSameLine": false,
  "prettier.arrowParens": "always",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Aggregated JSON (style.config.json)

This can be consumed by tooling or scripts:

```json
{
  "indent": 2,
  "lineLength": 100,
  "quotes": "single",
  "semicolons": true,
  "trailingComma": "all",
  "module": "es",
  "lineEnding": "lf",
  "braceSpacing": true,
  "importBraceSpacing": true,
  "wrapRules": {
    "parameters": "wrapAlways",
    "methodChains": "wrapAlways",
    "arrays": "wrapAlways",
    "ternary": "wrapAlways"
  },
  "eslint": {
    "noConsole": "warn",
    "noUnusedVars": "error",
    "preferConst": true,
    "arrowSpacing": true,
    "commaDangle": "always-multiline"
  },
  "prettier": {
    "singleQuote": true,
    "semi": true,
    "printWidth": 100,
    "tabWidth": 2,
    "trailingComma": "all",
    "arrowParens": "always"
  }
}
```

## Shell Export (Environment Variables)
Optional environment variable definitions:

```bash
export CODE_STYLE_INDENT=2
export CODE_STYLE_LINE_LENGTH=100
export CODE_STYLE_QUOTES=single
export CODE_STYLE_SEMICOLONS=required
export CODE_STYLE_TRAILING_COMMA=all
export CODE_STYLE_LINE_ENDING=lf
```

Use these in scripts for dynamic validation.

## Validation Script Snippet

```bash
#!/usr/bin/env bash
set -euo pipefail
FILES=$(git diff --name-only --cached | grep -E '\\.([jt]s|tsx)$' || true)
if [ -z "$FILES" ]; then
  echo "No JS/TS files staged."; exit 0
fi
npx eslint $FILES
npx prettier --check $FILES
```

## Sync Procedure For Another Repo

1. Copy `.editorconfig`, `.prettierrc`, `eslint.config.js`, `.idea/codeStyles/Project.xml`.
2. Add `.vscode/settings.json` (see above block).
3. Run `npm install --save-dev eslint prettier @eslint/js globals`.
4. Add package scripts: `"format": "prettier --write .", "lint": "eslint ."`.
5. Run initial normalization: `npm run format && npm run lint`.
6. Commit and push.

## Future Enhancements

- Add import ordering (e.g., `eslint-plugin-import`).
- Enforce consistent type-only imports for TypeScript.
- Add JSON schema validation for config files.
- Introduce markdown linting (`markdownlint-cli`).

## License
This configuration is part of the project and inherits the repository's license.

---
Generated on: 2025-11-22

