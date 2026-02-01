# Change Log

## [1.1.8] - 2026-02-01

### Added
* Reused the existing Microbit terminal to avoid creating multiple terminals.
* Improved ESLint quote validation.

### Changed
* Upgraded TypeScript to version 5.8.3.
* Upgraded Node.js to LTS version 22.16.0.
* Enabled strict TypeScript type checking.
* Updated npm packages for compatibility with the new Node.js version.
* Improved the `downloadRepo` function: it now downloads source files instead of cloning the repository.
* Replaced `console.log(error)` with `console.error(error)`.
* Fixed security vulnerabilities.
* Updated `README.md` to reflect recent changes.
* Updated `.gitignore` and `.vscodeignore`.

### Removed
* The `cleanUpWorkspace` function, which was removed after a reported issue with file deletion ([#10](https://github.com/oivron/microbit-extension-vscode/issues/10)). The function is no longer needed.
* The `createEnvFile` function as it is no longer necessary.
* Deprecated and unnecessary Python-related entries from Workspace settings.
* Unused npm modules.

## [1.0.10] - 2023-03-07

* Removed disabling Pylint messages by numerical IDs (e.g. W0614).
* Added disabling Pylint messages by category (e.g. W).
* Removed Show notifications list shortcut.
* Replaced icon.
* Added category Education.
* Updated Readme.
* npm updates.

## [1.0.9] - 2022-06-16

* Removed experimental feature allowing installation of third-party Python modules to $env:userprofile.
* Removed deprecated Pylint argument from workspace settings: disable=C0326 (bad-whitespace).
* Replaced icon.
* Updated Readme.
* Bug fixes.
* npm updates.

## [1.0.8] - 2022-06-07

* Updated Readme.

## [1.0.7] - 2022-04-06

* npm updates.

## [1.0.6] - 2022-03-16

* Minor updates.

## [1.0.5] - 2022-03-08

* Security updates.
* Added LICENCE file.

## [1.0.3] - 2021-09-03

### Added
* Code completely rewritten.
* Support for micro:bit V2.
* Improved micro:bit stub files.
* Reads error messages from the micro:bit.
* Experimental: If user not allowed to install third-party Python modules in the normal way, extension tries to install to $env:userprofile instead.

## [0.1.1] - 2021-02-16

### Added
* Installs additional third-party Python modules to a separate directory. This is because many schools does not allow installing to the site-packages directory.
* Sets Windows environment variables.
* Removed deprecated user settings and added a few more.

### Removed
* No longer searches for the location of the Python site-packages folder.

## [0.0.4] - 2020-08-14

### Added
* Minor updates and fixes.

## [0.0.3] - 2020-08-13

### Added
* Downloads and installs the following repo: https://github.com/oivron/bitbotxl.
* Removed information message "micro:bit Prepare completed!". It did not show up at the correct time.

## [0.0.2] - 2020-05-29

### Added
* Downloads and installs the following repo: https://github.com/oivron/mbitutils.
* Added microbit terminal.
* Added settings modification.

## [0.0.1] - 2020-05-26

- Initial release

### Added
* Determines and saves the location of the Python site-packages folder.
* Downloads and installs the following repo: https://github.com/PhonicCanine/microbit.
* Modifies user settings.
* Flashes microbit with uflash and microfs.
