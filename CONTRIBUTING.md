# Contributing

### Node

* [Node.js](https://nodejs.org/) - v6.0.0+
* [npm](https://www.npmjs.com/) - v3.0.0+

## Install project dependencies

### Code

* Fork and clone the bitbucket-server-cli repo

### Install project dependencies

`npm install`

This installs dependencies from `package.json`.

## npm scripts

`npm run lint`

This will:

* run linters

`npm test`

This will:

* run all of the mocha tests

## Code guidelines

### JS

bitbucket-server-cli utilizes ESLint to enforce JavaScript standards. Please see the `.eslintrc.json` file for ESLint config.

* [eslint](https://github.com/eslint/eslint)

#### Checking coding style

Run `npm run lint` before committing to ensure your changes follow our coding standards.

## Versioning

Please use the following commands to increment the package's version numbers
EX: Assume current version is 0.0.1

`npm version patch --no-git-tag-version`

If you run this command the version will increase the patch number (ie 0.0.2)

`npm version minor --no-git-tag-version`

If you run this command the version will increase the minor number (ie 0.1.0)

`npm version major --no-git-tag-version`

If you run this command the version will increase the major number (ie 1.0.0)


## EditorConfig

EditorConfig helps maintain consistent file formatting between different editors and developers. Please [install the plugin for you editor of choice](https://editorconfig.org/#download). Please see the `.editorconfig` file at the root of this repo to see what settings are enforced.

## License

Contributions to bitbucket-server-cli are subject to the [MIT License](https://github.com/tclindner/bitbucket-server-cli/blob/master/LICENSE).
