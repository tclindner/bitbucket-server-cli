'use strict';

/* eslint max-statements: 'off', max-params: 'off', no-magic-numbers: 'off', prefer-template: 'off' */
const chalk = require('chalk');
const prettyMs = require('pretty-ms');

class PullRequestStats {

  /**
   * Creates an instance of PullRequestStats.
   *
   * @param {Number} age Age of the PR
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @param {Number} commitCount The number of commits.
   * @param {Number} taskCount The number of tasks.
   * @param {String} issueKeys Issues that were resolved by the PR
   * @memberof PullRequestStats
   */
  constructor(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    this._sumOfAge = age;
    this._count = 1;
    this._sumOfCommits = commitCount;
    this._sumOfTasks = taskCount;
    this._issueKeys = issueKeys;
    this._countCreatedOnSunday = 0;
    this._countCreatedOnMonday = 0;
    this._countCreatedOnTuesday = 0;
    this._countCreatedOnWednesday = 0;
    this._countCreatedOnThursday = 0;
    this._countCreatedOnFriday = 0;
    this._countCreatedOnSaturday = 0;
    this._countMergedOnSunday = 0;
    this._countMergedOnMonday = 0;
    this._countMergedOnTuesday = 0;
    this._countMergedOnWednesday = 0;
    this._countMergedOnThursday = 0;
    this._countMergedOnFriday = 0;
    this._countMergedOnSaturday = 0;
    this._initializeCounts(createdWeekDay, mergedWeekDay);
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
   * @memberof PullRequestStats
   */
  updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    this._incrementCount();
    this._addAge(age);
    this._addCommits(commitCount);
    this._addTasks(taskCount);
    this._appendIssueKeys(issueKeys);
    this._incrementSumOnDay(createdWeekDay, 'created');
    this._incrementSumOnDay(mergedWeekDay, 'merged');
  }

  /**
   * Calculates the average
   *
   * @param {Number} sum Sum
   * @returns {Number} Average
   * @memberof PullRequestStats
   */
  _calcAvg(sum) {
    return (sum / this._count);
  }

  /**
   * Calculates the percentage
   *
   * @param {Number} sum Sum
   * @returns {Number} Percentage
   * @memberof PullRequestStats
   */
  _calcPct(sum) {
    return ((sum / this._count) * 100);
  }

  /**
   * Init counts
   *
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _initializeCounts(createdWeekDay, mergedWeekDay) {
    this._incrementSumOnDay(createdWeekDay, 'created');
    this._incrementSumOnDay(mergedWeekDay, 'merged');
  }

  /**
   * Increments the total count of pull requests
   *
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCount() {
    this._count += 1;
  }

  /**
   * Adds the age
   *
   * @param {Number} age The age of the pull request
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _addAge(age) {
    this._sumOfAge += age;
  }

  /**
   * Add the count of commits to the running sum
   *
   * @param {Number} commitCount The count of commits
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _addCommits(commitCount) {
    this._sumOfCommits += commitCount;
  }

  /**
   * Add the count of tasks to the running sum
   *
   * @param {Number} taskCount The count of tasks
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _addTasks(taskCount) {
    this._sumOfTasks += taskCount;
  }

  /**
   * Appends the issue keys to the message
   *
   * @param {String} issueKeys String of issue keys
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _appendIssueKeys(issueKeys) {
    if (issueKeys !== '') {
      this._issueKeys = this._issueKeys === '' ? issueKeys : `${this._issueKeys}, ${issueKeys}`;
    }
  }

  /**
   * Increments count by day
   *
   * @param {Number} weekDayInt JavaScript int value for the day of the week
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementSumOnDay(weekDayInt, countType) {
    switch (weekDayInt) {
      case 0: {
        this._incrementCountOnSunday(countType);
        break;
      }

      case 1: {
        this._incrementCountOnMonday(countType);
        break;
      }

      case 2: {
        this._incrementCountOnTuesday(countType);
        break;
      }

      case 3: {
        this._incrementCountOnWednesday(countType);
        break;
      }

      case 4: {
        this._incrementCountOnThursday(countType);
        break;
      }

      case 5: {
        this._incrementCountOnFriday(countType);
        break;
      }

      case 6: {
        this._incrementCountOnSaturday(countType);
        break;
      }
    }
  }

  /**
   * Increments Sunday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnSunday(countType) {
    if (countType === 'created') {
      this._countCreatedOnSunday += 1;
    } else {
      this._countMergedOnSunday += 1;
    }
  }

  /**
   * Increments Monday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnMonday(countType) {
    if (countType === 'created') {
      this._countCreatedOnMonday += 1;
    } else {
      this._countMergedOnMonday += 1;
    }
  }

  /**
   * Increments Tuesday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnTuesday(countType) {
    if (countType === 'created') {
      this._countCreatedOnTuesday += 1;
    } else {
      this._countMergedOnTuesday += 1;
    }
  }

  /**
   * Increments Wednesday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnWednesday(countType) {
    if (countType === 'created') {
      this._countCreatedOnWednesday += 1;
    } else {
      this._countMergedOnWednesday += 1;
    }
  }

  /**
   * Increments Thursday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnThursday(countType) {
    if (countType === 'created') {
      this._countCreatedOnThursday += 1;
    } else {
      this._countMergedOnThursday += 1;
    }
  }

  /**
   * Increments Friday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnFriday(countType) {
    if (countType === 'created') {
      this._countCreatedOnFriday += 1;
    } else {
      this._countMergedOnFriday += 1;
    }
  }

  /**
   * Increments Saturday counter
   *
   * @param {String} countType Created or merged
   * @returns {Undefined} No return
   * @memberof PullRequestStats
   */
  _incrementCountOnSaturday(countType) {
    if (countType === 'created') {
      this._countCreatedOnSaturday += 1;
    } else {
      this._countMergedOnSaturday += 1;
    }
  }

  /**
   * Get the message
   *
   * @returns {String} Formatted message
   * @memberof PullRequestStats
   */
  getMessage() {
    let message = this._getTotalsMessage();
    message += this._getAveragesMessage();
    message += this._getPercentsMessage();
    message += this._getIssuesMessage();

    return message;
  }

  /**
   * Get the totals message
   *
   * @returns {String} Formatted message
   * @memberof PullRequestStats
   */
  _getTotalsMessage() {
    let message = '\t\t' + chalk.cyan.bold('Total number of PRs: ') + chalk.cyan(this._count) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number of commits: ') + chalk.cyan(this._sumOfCommits) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number of tasks: ') + chalk.cyan(this._sumOfTasks) + '\n\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Sunday: ') + chalk.blue(this._countCreatedOnSunday) + '\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Monday: ') + chalk.blue(this._countCreatedOnMonday) + '\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Tuesday: ') + chalk.blue(this._countCreatedOnTuesday) + '\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Wednesday: ') + chalk.blue(this._countCreatedOnWednesday) + '\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Thursday: ') + chalk.blue(this._countCreatedOnThursday) + '\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Friday: ') + chalk.blue(this._countCreatedOnFriday) + '\n';
    message += '\t\t' + chalk.blue.bold('Total number PRs created on Saturday: ') + chalk.blue(this._countCreatedOnSaturday) + '\n\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Sunday: ') + chalk.cyan(this._countMergedOnSunday) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Monday: ') + chalk.cyan(this._countMergedOnMonday) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Tuesday: ') + chalk.cyan(this._countMergedOnTuesday) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Wednesday: ') + chalk.cyan(this._countMergedOnWednesday) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Thursday: ') + chalk.cyan(this._countMergedOnThursday) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Friday: ') + chalk.cyan(this._countMergedOnFriday) + '\n';
    message += '\t\t' + chalk.cyan.bold('Total number PRs merged on Saturday: ') + chalk.cyan(this._countMergedOnSaturday) + '\n\n';

    return message;
  }

  /**
   * Get the averages message
   *
   * @returns {String} Formatted message
   * @memberof PullRequestStats
   */
  _getAveragesMessage() {
    let message = '\t\t' + chalk.blue.bold('Average Age: ') + chalk.blue(prettyMs(this._calcAvg(this._sumOfAge))) + '\n';
    message += '\t\t' + chalk.blue.bold('Average number of commits: ') + chalk.blue(this._calcAvg(this._sumOfCommits)) + '\n';
    message += '\t\t' + chalk.blue.bold('Average number of tasks: ') + chalk.blue(this._sumOfTasks / this._count) + '\n\n';

    return message;
  }

  /**
   * Get the percent message
   *
   * @returns {String} Formatted message
   * @memberof PullRequestStats
   */
  _getPercentsMessage() {
    let message = '\t\t' + chalk.cyan.bold('Pct PRs created on Sunday: ') + chalk.cyan(this._calcPct(this._countCreatedOnSunday)) + '%\n';
    message += '\t\t' + chalk.cyan.bold('Pct PRs created on Monday: ') + chalk.cyan(this._calcPct(this._countCreatedOnMonday)) + '%\n';
    message += '\t\t' + chalk.cyan.bold('Pct PRs created on Tuesday: ') + chalk.cyan(this._calcPct(this._countCreatedOnTuesday)) + '%\n';
    message += '\t\t' + chalk.cyan.bold('Pct PRs created on Wednesday: ') + chalk.cyan(this._calcPct(this._countCreatedOnWednesday)) + '%\n';
    message += '\t\t' + chalk.cyan.bold('Pct PRs created on Thursday: ') + chalk.cyan(this._calcPct(this._countCreatedOnThursday)) + '%\n';
    message += '\t\t' + chalk.cyan.bold('Pct PRs created on Friday: ') + chalk.cyan(this._calcPct(this._countCreatedOnFriday)) + '%\n';
    message += '\t\t' + chalk.cyan.bold('Pct PRs created on Saturday: ') + chalk.cyan(this._calcPct(this._countCreatedOnSaturday)) + '%\n\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Sunday: ') + chalk.blue(this._calcPct(this._countMergedOnSunday)) + '%\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Monday: ') + chalk.blue(this._calcPct(this._countMergedOnMonday)) + '%\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Tuesday: ') + chalk.blue(this._calcPct(this._countMergedOnTuesday)) + '%\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Wednesday: ') + chalk.blue(this._calcPct(this._countMergedOnWednesday)) + '%\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Thursday: ') + chalk.blue(this._calcPct(this._countMergedOnThursday)) + '%\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Friday: ') + chalk.blue(this._calcPct(this._countMergedOnFriday)) + '%\n';
    message += '\t\t' + chalk.blue.bold('Pct PRs merged on Saturday: ') + chalk.blue(this._calcPct(this._countMergedOnSaturday)) + '%\n';

    return message;
  }

  /**
   * Get a formatted message for an issue
   *
   * @returns {String} Formatted issue message
   * @memberof PullRequestStats
   */
  _getIssuesMessage() {
    return '\t\t' + chalk.cyan.bold('Issues Resolved: ') + chalk.cyan(this._issueKeys) + '\n';
  }

}

module.exports = PullRequestStats;
