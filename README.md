# Recommended Settings README

This extension updates User Settings with settings that could benefit screen reader users.

## Features

When installed, you will have two commands available from Command Palette (Ctrl+Shift+P):

- Recommended User Settings (Screen Readers)
- Toggle Quick Suggestions Ctrl+Alt+Q

### Recommended User Settings (Screen Readers)

Updates User Settings as described below.

```
// Git
"git.enabled": false,
"git.autofetch": false,
"git.ignoreMissingGitWarning": true,

// Workbench
"workbench.editor.enablePreview": false,
"workbench.tips.enabled": false,
"workbench.startupEditor": "none",

// Editor
"editor.minimap.enabled": false,
"editor.hover.enabled": false,
"editor.parameterHints.enabled": false,

// Python
"jupyter.disableJupyterAutoStart": true,
"python.linting.pylintArgs": [
    "--disable=W0614", // unused-wildcard-import
    "--disable=C0111", // missing-docstring
    "--disable=W0401", // wildcard-import
    "--disable=C0411", // wrong-import-order
    "--disable=C0413", // wrong-import-position
    "--disable=E0401", // import-error
    "--disable=C0326", // bad-whitespace
    "--disable=C0303" // trailing-whitespace
]

// Miscellaneous
"extensions.ignoreRecommendations": true,
"editor.accessibilitySupport": "on",
```

### Toggle Quick Suggestions Ctrl+Alt+Q

Toggles  Quick Suggestions on or off.

```
// Quick Suggestions off
"editor.quickSuggestions": {
    "other": false,
    "comments": false,
    "strings": false
}

// Quick Suggestions on (default)
"editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": false
}
```

## Known Issues

## Release Notes

### 0.0.1 2021-05-18

Initial release.
