'use strict';

/* eslint max-statements: 'off', max-params: 'off', no-magic-numbers: 'off', prefer-template: 'off', id-length: 'off', indent: 'off', class-methods-use-this: 'off' */
const chalk = require('chalk');
const prettyMs = require('pretty-ms');
const roundTo = require('round-to');

class Stats {

  /**
   * Creates an instance of Stats.
   *
   * @param {Number} age Age of the PR
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @param {Number} commitCount The number of commits.
   * @param {Number} taskCount The number of tasks.
   * @param {String} issueKeys Issues that were resolved by the PR
   * @memberof Stats
   */
  constructor(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    this._sumOfAge = age;
    this._count = 1;
    this._sumOfCommits = commitCount;
    this._sumOfTasks = taskCount;
    this._issueKeys = issueKeys;
    this._createdOnDayCount = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    };
    this._mergedOnDayCount = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    };
    this._createdOnDayCount[createdWeekDay] += 1;
    this._mergedOnDayCount[mergedWeekDay] += 1;
  }

  /**
   * Update the stats
   *
   * @param {Number} age Age of the PR
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @param {Number} commitCount The number of commits.
   * @param {Number} taskCount The number of tasks.
   * @param {String} issueKeys Issues that were resolved by the PR
   * @returns {Undefined} No return
   * @memberof Stats
   */
  update(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    this._count += 1;
    this._sumOfAge += age;
    this._sumOfCommits += commitCount;
    this._sumOfTasks += taskCount;
    this._appendIssueKeys(issueKeys);
    this._createdOnDayCount[createdWeekDay] += 1;
    this._mergedOnDayCount[mergedWeekDay] += 1;
  }

  /**
   * Calculates the average
   *
   * @param {Number} sum Sum
   * @returns {Number} Average
   * @memberof Stats
   */
  _calcAvg(sum) {
    return sum / this._count;
  }

  /**
   * Calculates the percentage
   *
   * @param {Number} sum Sum
   * @returns {Number} Percentage
   * @memberof Stats
   */
  _calcPct(sum) {
    return roundTo((sum / this._count) * 100, 2);
  }

  /**
   * Appends the issue keys to the message
   *
   * @param {String} issueKeys String of issue keys
   * @returns {Undefined} No return
   * @memberof Stats
   */
  _appendIssueKeys(issueKeys) {
    if (issueKeys !== '') {
      this._issueKeys = this._issueKeys === '' ? issueKeys : `${this._issueKeys}, ${issueKeys}`;
    }
  }

  /**
   * Get the message
   *
   * @returns {String} Formatted message
   * @memberof Stats
   */
  getMessage() {
    let message = this._getTotalsMessage();

    message += this._getAveragesMessage();
    message += this._getWeekdayMessage();
    message += this._getIssuesMessage();

    return message;
  }

  /**
   * Get the totals message
   *
   * @returns {String} Formatted message
   * @memberof Stats
   */
  _getTotalsMessage() {
    let message = chalk.cyan.bold('Total number of PRs: ') + chalk.white(this._count) + '\n';

    message += chalk.cyan.bold('Total number of commits: ') + chalk.white(this._sumOfCommits) + '\n';
    message += chalk.cyan.bold('Total number of tasks: ') + chalk.white(this._sumOfTasks) + '\n\n';

    return message;
  }

  /**
   * Get the averages message
   *
   * @returns {String} Formatted message
   * @memberof Stats
   */
  _getAveragesMessage() {
    let message = chalk.cyan.bold('Average Age: ') + chalk.white(prettyMs(this._calcAvg(this._sumOfAge))) + '\n';

    message += chalk.cyan.bold('Average number of commits: ') + chalk.white(this._calcAvg(this._sumOfCommits)) + '\n';
    message += chalk.cyan.bold('Average number of tasks: ') + chalk.white(this._sumOfTasks / this._count) + '\n\n';

    return message;
  }

  /**
   * Get the percent message
   *
   * @returns {String} Formatted message
   * @memberof Stats
   */
  /* eslint-disable-next-line max-lines-per-function, require-jsdoc */
  _getWeekdayMessage() {
    let message = this._getDivider();

    message += `|${this._padString('', 20)}|`;
    message += `${this._padString('Sunday', 10)}|`;
    message += `${this._padString('Monday', 10)}|`;
    message += `${this._padString('Tuesday', 10)}|`;
    message += `${this._padString('Wednesday', 10)}|`;
    message += `${this._padString('Thursday', 10)}|`;
    message += `${this._padString('Friday', 10)}|`;
    message += `${this._padString('Saturday', 10)}| \n`;

    message += `${this._getDivider()}`;

    message += `|${chalk.cyan.bold(this._padString('Number PRs created', 20))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[0], 10))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[1], 10))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[2], 10))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[3], 10))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[4], 10))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[5], 10))}|`;
    message += `${chalk.white(this._padString(this._createdOnDayCount[6], 10))}| \n`;

    message += `${this._getDivider()}`;

    message += `|${chalk.cyan.bold(this._padString('Number PRs merged', 20))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[0], 10))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[1], 10))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[2], 10))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[3], 10))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[4], 10))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[5], 10))}|`;
    message += `${chalk.white(this._padString(this._mergedOnDayCount[6], 10))}| \n`;

    message += `${this._getDivider()}`;

    message += `|${chalk.cyan.bold(this._padString('Pct PRs created', 20))}|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[0]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[1]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[2]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[3]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[4]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[5]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._createdOnDayCount[6]), 9))}%| \n`;

    message += `${this._getDivider()}`;

    message += `|${chalk.cyan.bold(this._padString('Pct PRs merged', 20))}|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[0]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[1]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[2]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[3]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[4]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[5]), 9))}%|`;
    message += `${chalk.white(this._padString(this._calcPct(this._mergedOnDayCount[6]), 9))}%| \n`;

    message += `${this._getDivider()} \n`;

    return message;
  }

  /**
   * Pad string
   *
   * @param {String} string String to pad
   * @param {Number} length Desired length of the string
   * @returns {String} Padded string
   * @memberof Stats
   */
  _padString(string, length) {
    const padding = Array(length + 1).join(' ');

    return (padding + string).slice(-padding.length);
  }

  /**
   * Get a table divider string
   *
   * @returns {String} Table divider
   * @memberof Stats
   */
  _getDivider() {
    return '|--------------------|----------|----------|----------|----------|----------|----------|----------| \n';
  }

  /**
   * Get a formatted message for an issue
   *
   * @returns {String} Formatted issue message
   * @memberof Stats
   */
  _getIssuesMessage() {
    return chalk.cyan.bold('Issues Resolved: ') + chalk.white(this._issueKeys) + '\n';
  }

}

module.exports = Stats;
