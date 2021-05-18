# microbit README

The purpose of this extension is to create an easy to use environment for blind students who code the BBC micro:bit with Python. Block editors are hard to use and many text editors will not work well with assistive tools like screen readers. Visual Studio Code has great support for screen readers, preferably NVDA.

## Features

* Downloads and installs repo: https://github.com/PhonicCanine/microbit.
* Downloads and installs repo: https://github.com/oivron/mbitutils.
* Downloads and installs repo: https://github.com/oivron/bitbotxl.
* Creates a new directory for third-party Python modules.
* Adds Windows environment variables.
* Modifies user settings.
* Flashes microbit with uflash and microfs.

## How to use

1. First, create a new folder/workspace in Visual Studio Code.
2. Add Visual Studio Code extension https://marketplace.visualstudio.com/items?itemName=ms-python.python.
3. Add this extension.
4. Restart Visual Studio Code.
5. Open Command Palette, select __micro:bit Prepare__.
6. Restart Visual Studio Code.
7. Write your Python script for micro:bit or Bit:bot XL.
8. Flash your micro:bit using Ctrl+F5 (or Command Palette __micro:bit Flash__).

## Requirements

## Known Issues

## Release Notes

## [0.1.1] - 2021-02-16

### Added
* Installs additional third-party Python modules to a separate directory. This is because many schools does not allow installing to the site-packages directory.
* Sets Windows environment variables.
* Removed deprecated user settings and added a few more.

### Removed
* No longer searches for the location of the Python site-packages folder.
