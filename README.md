# bitbucket-server-cli

> CLI for interacting with Bitbucket Server

[![license](https://img.shields.io/github/license/tclindner/bitbucket-server-cli.svg?maxAge=2592000&style=flat-square)](https://github.com/tclindner/bitbucket-server-cli/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/bitbucket-server-cli.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/bitbucket-server-cli)
[![Travis](https://img.shields.io/travis/tclindner/bitbucket-server-cli.svg?maxAge=2592000?style=flat-square)](https://travis-ci.org/tclindner/bitbucket-server-cli)
[![Dependency Status](https://david-dm.org/tclindner/bitbucket-server-cli.svg?style=flat-square)](https://david-dm.org/tclindner/bitbucket-server-cli)
[![devDependency Status](https://david-dm.org/tclindner/bitbucket-server-cli/dev-status.svg?style=flat-square)](https://david-dm.org/tclindner/bitbucket-server-cli#info=devDependencies)

## What is bitbucket-server-cli?

bitbucket-server-cli helps you quickly scan your Bitbucket repositories.
Currently it can:

* Audit permissions to ensure all of your repositories are configured similarly
* Finds stale pull requests
* Compiles statistics about pull requests

## How do I install?

First thing first, let's make sure you have the necessary pre-requisites.

### System Dependencies

#### Node

* [Node.js](https://nodejs.org/) - v6.0.0+
* [npm](http://npmjs.com) - v3.0.0+

## Install

* `npm install bitbucket-server-cli -g`

### Set environment variables

Set the following environment variables:

* BITBUCKET_BASE_URL, ex: `https://bitbucketserver.myserver.com`
* BITBUCKET_USERNAME, ex: `username`
* BITBUCKET_PASSWORD, ex: `password`

## Commands and configuration

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

### Global Options

| Option | Alias | Description |
|---|---|---|
| bitbucket-server-cli --help | bitbucket-server-cli -h | Lists supported CLI options |
| bitbucket-server-cli --version | bitbucket-server-cli -v | Lists the current version number |
| bitbucket-server-cli --projects | bitbucket-server-cli -p | Comma separated list of Bitbucket project keys |

### Commands

#### bitbucket-server-cli audit-permissions

> Audits permissions

*Alias:* ap

[Permissions README](src/plugins/permissions/README.md)

Examples
`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -c "./permissionsConfig.json" audit-permissions`

`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -c "./permissionsConfig.json" ap`

Please see the [Permissions README](src/plugins/permissions/README.md) for additional examples.

#### bitbucket-server-cli stale-prs

> Fetches a list of stale pull requests

*Alias:* sp

[Stale PRs README](src/plugins/stale-prs/README.md)

Examples
`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -s "30 days" stale-prs`

`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -s "30 days" sp`

Please see the [Stale PRs README](src/plugins/stale-prs/README.md) for additional examples.

#### bitbucket-server-cli pr-stats

> Fetch PRs stats

*Alias:* s

[Pull Request Stats README](src/plugins/stats/README.md)

Examples
`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -r "30 days" pr-stats`

`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -r "30 days" s`

Please see the [Pull Request Stats README](src/plugins/stats/README.md) for additional examples.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## Release History

Please see [CHANGELOG.md](CHANGELOG.md).

## License

Copyright (c) 2017-2018 Thomas Lindner. Licensed under the MIT license.
