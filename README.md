# microbit README

A Visual Studio Code extension for students who code the BBC micro:bit or the 4tronix Bit:Bot XL with Python. Initially intended for visually impaired children, but can be used by anyone who prefer to code the micro:bit with text rather than block.

## Features

* Provides type hints.
* Supports both micro:bit V1 and V2.
* Flashes the micro:bit with your script.
* Reads error messages from the micro:bit (REPL).
* Modifies workspace settings (see below).
* Experimental: Some users are not allowed to install third-party Python modules on their computer. In that case the extension will try to install to $env:userprofile.

## How to use

### Getting started

1. First, create a new folder/workspace in Visual Studio Code.
2. Make sure you have the following extension installed: https://marketplace.visualstudio.com/items?itemName=ms-python.python.
3. Add this extension.
4. Open Command Palette, select __micro:bit Prepare__.
5. Restart Visual Studio Code.
6. Write your Python script for micro:bit or Bit:Bot XL.
7. Flash your micro:bit using __Ctrl+F5__ (or Command Palette __micro:bit Flash__).

### Read error messages

You can read error messages from the micro:bit.

1. Open Windows Device Manager (__Win+X, Device Manager__) to find the micro:bit COM port.
2. Open Command Palette and select __micro:bit: Set COM port__.
3. Enter the COM port number from the Device Manager.
4. Make sure that your script is running on the micro:bit.
5. Open Command Palette and select __micro:bit: Read micro:bit (REPL)__ or press __Ctrl+Alt+F5__.
6. Any error messages will be written to the terminal.

## Available Commands and keyboard short cuts

| Command                              | Keyboard        | Description                                              |
| -----------                          | -----------     | -----------                                              |
| __micro:bit: Flash__                 | __Ctrl+F5__     | Flash your micro:bit with the currently open script.     |
| __micro:bit: Prepare__               | N/A             | Prepare VSCode for working with the micro:bit.           |
| __micro:bit: Set COM port__          | N/A             | Set the micro:bit COM port (found in the Device Manager).|
| __micro:bit: Read micro:bit (REPL)__ | __Ctrl+Alt+F5__ | Read error messages on the micro:bit.                    |
| __Show notifications list__          | __Ctrl+Alt+N__  | Access the Notifications list.                           |

## Workspace settings

This extension modifies workspace settings in the following way:

```
"python.languageServer": "Pylance",
"python.linting.enabled": true,
"python.linting.pylintEnabled": true,
"python.analysis.autoSearchPaths": true,
"python.autoComplete.extraPaths": [
    ".microbit-stubs/microbit/lib"
],
"python.analysis.extraPaths": [
    ".microbit-stubs/microbit/lib"
],
"files.exclude": {
    ".microbit-stubs": true,
    ".vscode": true,
    ".env": true
},
"python.envFile": "${workspacefolder}/.env",
"python.linting.pylintArgs": [
    "--disable=W0614",
    "--disable=C0111",
    "--disable=W0401",
    "--disable=C0411",
    "--disable=C0413",
    "--disable=E0401",
    "--disable=C0326",
    "--disable=C0303",
    "--disable=C0305"
]
```

## Release Notes

## [1.0.6] - 2022-03-16

* Minor updates.