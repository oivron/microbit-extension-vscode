# microbit README

The purpose of this extension is to create an easy to use environment for blind students to code the BBC micro:bit with Python. Block editors are hard to use and many text editors will not work well with assistive tools like screen readers.

## Features

This extension:
* Determines and saves the location of the Python site-packages folder.
* Downloads and installs repo: https://github.com/PhonicCanine/microbit.
* Downloads and installs repo: https://github.com/oivron/mbitutils.
* Downloads and installs repo: https://github.com/oivron/bitbotxl.
* Modifies user settings.
* Flashes microbit with uflash and microfs.

## How to use

1. First, create a new folder/workspace in Visual Studio Code.
2. Add Visual Studio Code extension https://marketplace.visualstudio.com/items?itemName=ms-python.python.
3. Add this extension.
4. Restart Visual Studio Code.
5. Open Command Palette, select __micro:bit Prepare__.
6. Reload window.
7. Write your Python script for micro:bit or Bit:bot XL.
8. Flash your micro:bit using Ctrl+F5 (or Command Palette __micro:bit Flash__).

## Requirements

## Known Issues

## Release Notes

### 0.0.3

* Downloads and installs the following repo: https://github.com/oivron/bitbotxl.
* Removed information message "micro:bit Prepare completed!". It did not show up at the correct time.