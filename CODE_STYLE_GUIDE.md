# Code Style Configuration Explanation

**Project**: scarmServer (LLM Framework)
**Compatible With**: JetBrains IDEs 2023.1+  
**Last Updated**: November 22, 2025

---

This custom code style configuration ensures that all code in the scarmServer project follows LLM Framework standards automatically, reducing manual formatting effort and maintaining consistency across the development team.

## Conclusion

````
const config = {port: 3000, host: 'localhost'};
// Not this

const config = { port: 3000, host: 'localhost' };
// Enforced spacing
```javascript
### Object Literal Spacing

````

import { CONFIG, HTTP_STATUS } from '../config/constants.js';
import { info, error, warn } from '../utils/logger.js';
// Properly formatted imports

```javascript
### Import Formatting

```

);
param5
param4,
param3,
param2,
param1,
const result = someVeryLongFunctionName(
// After wrapping (auto-wrapped at 100 chars)

const result = someVeryLongFunctionName(param1, param2, param3, param4, param5);
// Before wrapping

```javascript
Example:

- Ternary operations
- Array initializers
- Binary operations
- Method chains
- Method parameters
The configuration includes smart wrapping for:
### Wrap Settings

## Advanced Features

3. Re-import the project
2. Clear IDE caches: **File** → **Invalidate Caches / Restart**
1. Verify you're using the latest version of the config files
### Different Formatting on Auto-Format?

3. The configurations are designed to be compatible
2. Run `npm run format` to apply Prettier formatting
1. Run `npm run lint:fix` to align code with ESLint rules
### Conflicts with ESLint/Prettier?

3. Check that `Project.xml` exists in `.idea/codeStyles/`
2. Restart the IDE
1. Ensure **Use per-project settings** is enabled in Code Style preferences
### Settings Not Applied?

## Troubleshooting

6. Commit the updated file to share with the team
5. The changes will be saved to `Project.xml`
4. Click **Apply** → **OK**
3. Make your changes
2. Select **JavaScript** or **TypeScript**
1. Open **Settings/Preferences** → **Editor** → **Code Style**

To modify the code style:

## Customization

- camelCase/PascalCase/UPPER_SNAKE_CASE naming
- 100-character line length
- Semicolons required
- Single quotes
- 2-space indentation
- ES Modules only
The configuration enforces all requirements from your global coding instructions:
### 4. Compliance with LLM Framework Standards

Clone the repo, open in JetBrains IDE, and the settings are already applied.
### 3. Zero Configuration for New Developers

No discussions about formatting—the IDE handles it automatically.
### 2. Reduced Code Review Friction

Every team member sees and writes code the same way, regardless of personal IDE settings.
### 1. Consistency Across the Team

## Benefits

Individual workspace settings like `.idea/workspace.xml` are excluded via `.gitignore` to avoid conflicts with personal IDE preferences.
### Excluded from Git

- **CI/CD Integration**: Same style rules in pipelines
- **New Developer Onboarding**: Settings applied automatically on clone
- **Team Consistency**: All developers use the same formatting
The `.idea/codeStyles/` directory is included in version control to ensure:
### Files Included in Git

## Version Control

All tools are configured to work together harmoniously without conflicts.

```

}
"tabWidth": 2
"singleQuote": true,
"semi": true,
{

```json
Handles automatic code formatting:
### Prettier (.prettierrc)

```

}
}
"indent": ["error", 2]
"quotes": ["error", "single"],
"semi": ["error", "always"],
"rules": {
{

```json
Enforces code quality rules:
### ESLint (.eslintrc.json)

```

quote_type = single
indent_size = 2
indent_style = space
[*.{js,ts}]

```ini
Provides baseline settings for any editor:
### EditorConfig (.editorconfig)

The custom code style works in conjunction with:

## Integration with Other Tools

- Line length violations
- Indentation inconsistencies
- Semicolon usage (warns on missing semicolons)
- Quote style (warns on double quotes)
Real-time code inspection will highlight violations of:
### 5. Code Inspection

- Lines exceeding 100 characters
- Incorrect indentation
- Double quotes that should be single
- Missing semicolons
The IDE will suggest fixes for:
### 4. On-the-Fly Suggestions

- Proper spacing in import statements
- Use ES Module syntax (`import`/`export`)
- Organize imports automatically
### 3. Import Organization

- Variable declarations
- Import statements
- Method implementations
- Constructor stubs
All IDE-generated code will follow the custom style:
### 2. Code Generation

- Add proper spacing in object literals
- Enforce 100-character line length
- Add missing semicolons
- Convert double quotes to single quotes
- Reformat code to 2-space indentation
### 1. Automatic Code Formatting (Ctrl+Alt+L / Cmd+Alt+L)

When a developer opens this project in a JetBrains IDE, the IDE will automatically:

## Practical Impact

```

</codeStyleSettings>
  </indentOptions>
    <option name="TAB_SIZE" value="2" />
    <option name="INDENT_SIZE" value="2" />
  <indentOptions>
  <option name="RIGHT_MARGIN" value="100" />
<codeStyleSettings language="JavaScript">
```xml
#### Code Style Settings

- **Import Spacing**: Spaces inside import statements
- **Object Braces**: Spaces inside `{ }` for object literals
- **Quotes**: Single quotes only (double quotes disabled)
- **Semicolons**: Always required
  Key enforcements:

````
</JSCodeStyleSettings>
  <!-- More settings... -->
  <option name="SPACES_WITHIN_OBJECT_LITERAL_BRACES" value="true" />
  <option name="USE_DOUBLE_QUOTES" value="false" />
  <option name="FORCE_SEMICOLON_STYLE" value="true" />
  <option name="USE_SEMICOLON_AFTER_STATEMENT" value="true" />
<JSCodeStyleSettings version="0">
```xml
#### JavaScript/TypeScript Settings

### Language-Specific Configurations

````

</component>
  </code_scheme>
    <!-- Language-specific settings -->
  <code_scheme name="Project" version="173">
<component name="ProjectCodeStyleConfiguration">
```xml

The file uses JetBrains' component-based architecture:

## Component Structure

- **Wrapping**: Smart wrapping for long lines
- **Spacing**: Configured for object literals, imports, and expressions
- **Semicolons**: Required after statements
- **Quotes**: Single quotes enforced (with backticks for templates)
- **Line Length**: 100 characters maximum
- **Indentation**: 2 spaces for JavaScript, TypeScript, and JSON

This file contains the complete custom code style scheme tailored for the LLM Framework standards:

### 2. Project.xml

The `USE_PER_PROJECT_SETTINGS` option tells the IDE to use the custom project-specific code style scheme defined in `Project.xml` instead of the user's global IDE settings.

````
</component>
  </state>
    <option name="USE_PER_PROJECT_SETTINGS" value="true" />
  <state>
<component name="ProjectCodeStyleConfiguration">
```xml

This file enables per-project code style settings:
### 1. codeStyleConfig.xml

The code style configuration consists of two files:

## Configuration Files

This XML file is a JetBrains IDE configuration file that defines code styling preferences for the scarmServer project. It's located in the `.idea/codeStyles/` directory, which is where JetBrains IDEs (such as IntelliJ IDEA, WebStorm, PyCharm, etc.) store project-specific settings.

## Overview


````
