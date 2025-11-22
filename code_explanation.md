# Code Style Configuration Explanation

## Overview

This project uses a **per-project JetBrains code style configuration** stored under `.idea/codeStyles/`. These settings ensure every contributor gets identical formatting (indentation, wrapping, spacing, quotes, semicolons, line length) regardless of local IDE defaults.

The configuration replaces the older `PREFERRED_PROJECT_CODE_STYLE="Default"` approach with `USE_PER_PROJECT_SETTINGS=true`, pointing the IDE to the custom scheme defined in `Project.xml`.

## Files Involved

| File | Purpose |
|------|---------|
| `.idea/codeStyles/codeStyleConfig.xml` | Activates per-project settings (`USE_PER_PROJECT_SETTINGS`) |
| `.idea/codeStyles/Project.xml` | Actual style rules for JavaScript, TypeScript, JSON |
| `.editorconfig` | Cross-editor baseline (indent, charset, eol) |
| `eslint.config.js` | Lint rules (semicolons, quotes, indent, max length) |
| `.prettierrc` | Formatting (single quotes, 2 spaces, 100 print width) |

These layers are intentionally aligned to avoid conflicts.

## Activation Mechanism

`codeStyleConfig.xml` content:
```xml
<component name="ProjectCodeStyleConfiguration">
  <state>
    <option name="USE_PER_PROJECT_SETTINGS" value="true" />
  </state>
</component>
```
This instructs JetBrains to load the `Project` scheme defined in `Project.xml` instead of any global or "Default" scheme.

## Key Rules in `Project.xml`

Excerpt (simplified for clarity):
```xml
<option name="RIGHT_MARGIN" value="100" />
<JSCodeStyleSettings>
  <option name="FORCE_SEMICOLON_STYLE" value="true" />
  <option name="USE_DOUBLE_QUOTES" value="false" />
  <option name="SPACES_WITHIN_OBJECT_LITERAL_BRACES" value="true" />
  <option name="SPACES_WITHIN_IMPORTS" value="true" />
</JSCodeStyleSettings>
<TypeScriptCodeStyleSettings>
  <!-- same as JS -->
</TypeScriptCodeStyleSettings>
<codeStyleSettings language="JavaScript">
  <option name="RIGHT_MARGIN" value="100" />
  <indentOptions>
    <option name="INDENT_SIZE" value="2" />
    <option name="CONTINUATION_INDENT_SIZE" value="2" />
    <option name="TAB_SIZE" value="2" />
  </indentOptions>
</codeStyleSettings>
```

### Formatting Rules (Mapped to LLM Framework Standards)
| Aspect | Setting | Purpose |
|--------|---------|---------|
| Line width | 100 characters | Maintain readability & diff friendliness |
| Indentation | 2 spaces (no tabs) | Consistency & compact code |
| Quotes | Single (`USE_DOUBLE_QUOTES=false`) | Standardized style, easy diffing |
| Semicolons | Forced (`FORCE_SEMICOLON_STYLE=true`) | Avoid ASI pitfalls |
| Object literals | Spaces inside braces | Improved readability `{ key: 'value' }` |
| Imports | Spaces inside braces | Consistent `import { thing } from '...'` |
| Wrapping | Normal wrap for params, chains, arrays, ternaries | Prevent horizontal scroll |

## Alignment With Supporting Tools

| Concern | JetBrains | ESLint (`eslint.config.js`) | Prettier (`.prettierrc`) | EditorConfig |
|---------|----------|-----------------------------|---------------------------|--------------|
| Indent  | 2 spaces | `indent: ["error", 2]` | `tabWidth: 2` | `indent_size = 2` |
| Quotes  | Single   | `quotes: ["error", "single"]` | `singleQuote: true` | `quote_type = single` |
| Semicolons | Forced | `semi: ["error", "always"]` | `semi: true` | N/A |
| Max length | 100 | `max-len: 100 (warn)` | `printWidth: 100` | `max_line_length = 100` |
| Line endings | LF | Handled by Git/IDE | `endOfLine: lf` | `end_of_line = lf` |

## Practical Impact

Using Format (Ctrl+Alt+L / Cmd+Alt+L), Generate Code, or Optimize Imports will:
- Enforce single quotes & semicolons.
- Maintain 2-space indentation.
- Apply spacing conventions inside object/ import braces.
- Suggest wrapping beyond column 100.

## Typical Scenarios

| Action | Result |
|--------|--------|
| Paste tab-indented snippet | Auto-converts to 2 spaces on reformat |
| Use double quotes in code | ESLint & Prettier convert to single quotes |
| Forget semicolon | Auto-added by formatter / flagged by ESLint |
| Long method chain | Wrapped according to wrap settings |

## How To Modify Safely
1. Open IDE Settings → Editor → Code Style → (JavaScript / TypeScript).
2. Change desired rule (e.g., Right margin from 100 → 110).
3. Reformat a few files locally.
4. Ensure ESLint/Prettier remain consistent (update those configs if needed).
5. Commit only `Project.xml` plus related tool config changes.
6. Run `npm run format:check` and `npm run lint` before pushing.

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Formatting not applied | Per-project not active | Confirm `USE_PER_PROJECT_SETTINGS=true` remains in `codeStyleConfig.xml` |
| Conflicting quote styles | Prettier not run | Run `npm run format` or enable on-save formatting |
| Large reformat diffs | Previous global style used | Accept diff once; project settings become new baseline |
| ESLint warnings on style | Out-of-sync rules | Align ESLint config with Editor/Prettier settings |

## Version Control Strategy

The `.idea/codeStyles/` directory is intentionally kept to distribute authoritative style rules. Other volatile IDE files (workspace, tasks) are ignored in `.gitignore` to prevent noisy diffs.

## Relation to Other Documentation
- `README.md` – High-level project & style summary.
- `CODE_STYLE_GUIDE.md` – Expanded style reasoning & examples.
- `QUICK_REFERENCE.md` – Fast daily commands & snippets.

## Summary

The current configuration implements LLM Framework standards through a layered approach (JetBrains scheme + EditorConfig + ESLint + Prettier). This eliminates style drift, reduces review noise, and guarantees deterministic formatting locally and in CI.

**Last Updated:** 2025-11-22
