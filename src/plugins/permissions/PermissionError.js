'use strict';

const chalk = require('chalk');

/* eslint max-params: 'off' */

class PermissionError {

  /**
   * Creates an instance of PermissionError.
   *
   * @param {String} project Bitbucket project key
   * @param {String} repo Bitbucket repo key?
   * @param {String} entity Bitbucket entity
   * @param {String} entityName Bitbucket entity name
   * @param {String} permission Bitbucket permission
   * @memberof PermissionError
   */
  constructor(project, repo, entity, entityName, permission) {
    this._project = project;
    this._repo = repo;
    this._entity = entity;
    this._entityName = entityName;
    this._permission = permission;
    this._isRepo = this._repo !== '' && this._repo !== null;
    this._errorMessage = '';
    this._toString();
  }

  /**
   * Generates permission error message
   *
   * @returns {Undefined} No return
   * @memberof PermissionError
   */
  _toString() {
    let message = chalk.bgWhite.black(`${this._isRepo ? 'Repo' : 'Project'} permission error detected \n`);

    message += `${chalk.white.bold('Project:')} ${chalk.white(this._project)} \n`;

    if (this._isRepo) {
      message += `${chalk.white.bold('Repo:')} ${chalk.white(this._repo)} \n`;
    }

    message += `${chalk.cyan.bold(`${this._entity}:`)} ${chalk.cyan(this._entityName)} \n`;
    message += `${chalk.cyan.bold('Permission:')} ${chalk.cyan(this._permission)} \n`;

    this._errorMessage = message;
  }

  /**
   * Gets the permission error message
   *
   * @returns {String} Permission error message
   * @memberof PermissionError
   */
  getMessage() {
    return this._errorMessage;
  }

}

module.exports = PermissionError;
