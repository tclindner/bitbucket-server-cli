'use strict';

const chalk = require('chalk');
const moment = require('moment');

class PullRequest {

  /**
   * Creates an instance of PullRequest.
   * @param {String} project Bitbucket project slug
   * @param {String} repo Bitbucket repo slug
   * @param {Object} pullRequest Bitbucket pull request object
   * @memberof PullRequest
   */
  constructor(project, repo, pullRequest) {
    this._project = project;
    this._repo = repo;
    this._id = pullRequest.id;
    this._title = pullRequest.title;
    this._author = pullRequest.author.name.displayName;
    this._createdDate = moment(pullRequest.createdDate).format('YYYY-MM-DD');
    this._age = moment(pullRequest.updatedDate).fromNow();
    this._fromBranchName = pullRequest.fromRef.displayId;
    this._toBranchName = pullRequest.toRef.displayId;
    this._message = '';
    this._toString();
  }

  /**
   * Generates stale pull request error message
   *
   * @returns {Undefined} No return
   * @memberof PullRequest
   */
  _toString() {
    let message = chalk.bgWhite.black('Stale pr detected \n');

    message += `${chalk.white.bold('Project:')} ${chalk.white(this._project)} \n`;
    message += `${chalk.white.bold('Repo:')} ${chalk.white(this._repo)} \n`;
    message += `${chalk.cyan.bold('ID:')} ${chalk.cyan(this._id)} \n`;
    message += `${chalk.cyan.bold('Title:')} ${chalk.cyan(this._title)} \n`;
    message += `${chalk.cyan.bold('Author:')} ${chalk.cyan(this._author)} \n`;
    message += `${chalk.cyan(this._fromBranchName)} ${chalk.cyan.bold(' --> ')} ${chalk.cyan(this._toBranchName)} \n`;
    message += `${chalk.cyan.bold('Last Updated: ')} ${chalk.cyan(this._age)} \n`;
    message += `${chalk.cyan.bold('Created On: ')} ${chalk.cyan(this._createdDate)} \n`;

    this._message = message;
  }

  /**
   * Gets a stale pull request message
   *
   * @returns {String} Stale pull request message
   * @memberof PullRequest
   */
  getMessage() {
    return this._message;
  }

}

module.exports = PullRequest;
