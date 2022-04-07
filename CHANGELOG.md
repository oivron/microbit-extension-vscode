# Change Log

All notable changes to the "micro:bit" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.1] - 2020-05-26

- Initial release

### Added
* Determines and saves the location of the Python site-packages folder.
* Downloads and installs the following repo: https://github.com/PhonicCanine/microbit.
* Modifies user settings.
* Flashes microbit with uflash and microfs.

## [0.0.2] - 2020-05-29

### Added
* Downloads and installs the following repo: https://github.com/oivron/mbitutils.
* Added microbit terminal.
* Added settings modification.

## [0.0.3] - 2020-08-13

### Added
* Downloads and installs the following repo: https://github.com/oivron/bitbotxl.
* Removed information message "micro:bit Prepare completed!". It did not show up at the correct time.

## [0.0.4] - 2020-08-14

### Added
* Minor updates and fixes.

## [0.1.1] - 2021-02-16

### Added
* Installs additional third-party Python modules to a separate directory. This is because many schools does not allow installing to the site-packages directory.
* Sets Windows environment variables.
* Removed deprecated user settings and added a few more.

### Removed
* No longer searches for the location of the Python site-packages folder.

## [1.0.3] - 2021-09-03

### Added
* Code completely rewritten.
* Support for micro:bit V2.
* Improved micro:bit stub files.
* Reads error messages from the micro:bit.
* Experimental: If user not allowed to install third-party Python modules in the normal way, extension tries to install to $env:userprofile instead.

## [1.0.5] - 2022-03-08

* Security updates.
* Added LICENCE file.

## [1.0.6] - 2022-03-16

* Minor updates.

## [1.0.7] - 2022-04-06

* npm updates.