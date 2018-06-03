# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added

### Changed

### Fixed

### Removed

## [0.4.0] - 2018-06-03
### Added
- Support for triggering permission errors if required permissions are missing from project/repo config.
- Bitbucket configuration via environment variables.

### Changed
- BREAKING CHANGES to the cli. Please the [README](README.md) for more information.

### Removed
- Ability to exclude repos
- Config files for stale pr and stats plugins

## [0.3.2] - 2017-11-05
### Changed
- Improve error handling for Bitbucket API calls. The cli now outputs the error message returned from Bitbucket.

## [0.3.1] - 2017-10-29
### Fixed
- Remove extra line breaks in stats table - [#18](https://github.com/tclindner/bitbucket-server-cli/issues/18)
- Properly round percentages in stats output - [#17](https://github.com/tclindner/bitbucket-server-cli/issues/17)

## [0.3.0] - 2017-10-29
### Added
- Add permissions plugin
- Add stale pull request plugin

## [0.2.0] - 2017-10-15
- Clean up ESLint issues
- Configure Travis and get the build passing
- Refactor the stats output. Tabular layout is used for days of the week!

## [0.1.0] - 2017-10-01
- First release. yay!
