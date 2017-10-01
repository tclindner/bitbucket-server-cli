'use strict';

const chalk = require('chalk');
const prettyMs = require('pretty-ms');

class PullRequestStats {
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

  updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    this._incrementCount();
    this._addAge(age);
    this._addCommits(commitCount);
    this._addTasks(taskCount);
    this._appendIssueKeys(issueKeys);
    this._incrementSumOnDay(createdWeekDay, 'created');
    this._incrementSumOnDay(mergedWeekDay, 'merged');
  }

  _calcAvg(sum) {
    return (sum / this._count);
  }

  _calcPct(sum) {
    return ((sum / this._count) * 100);
  }

  _initializeCounts(createdWeekDay, mergedWeekDay) {
    this._incrementSumOnDay(createdWeekDay, 'created');
    this._incrementSumOnDay(mergedWeekDay, 'merged');
  }

  _incrementCount() {
    this._count += 1;
  }

  _addAge(age) {
    this._sumOfAge += age;
  }

  _addCommits(commitCount) {
    this._sumOfCommits += commitCount;
  }

  _addTasks(taskCount) {
    this._sumOfTasks += taskCount;
  }

  _appendIssueKeys(issueKeys) {
    if (issueKeys !== '') {
      this._issueKeys = this._issueKeys === '' ? issueKeys : `${this._issueKeys}, ${issueKeys}`;
    }
  }

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

  _incrementCountOnSunday(countType) {
    if (countType === 'created') {
      this._countCreatedOnSunday += 1;
    } else {
      this._countMergedOnSunday += 1;
    }
  }

  _incrementCountOnMonday(countType) {
    if (countType === 'created') {
      this._countCreatedOnMonday += 1;
    } else {
      this._countMergedOnMonday += 1;
    }
  }

  _incrementCountOnTuesday(countType) {
    if (countType === 'created') {
      this._countCreatedOnTuesday += 1;
    } else {
      this._countMergedOnTuesday += 1;
    }
  }

  _incrementCountOnWednesday(countType) {
    if (countType === 'created') {
      this._countCreatedOnWednesday += 1;
    } else {
      this._countMergedOnWednesday += 1;
    }
  }

  _incrementCountOnThursday(countType) {
    if (countType === 'created') {
      this._countCreatedOnThursday += 1;
    } else {
      this._countMergedOnThursday += 1;
    }
  }

  _incrementCountOnFriday(countType) {
    if (countType === 'created') {
      this._countCreatedOnFriday += 1;
    } else {
      this._countMergedOnFriday += 1;
    }
  }

  _incrementCountOnSaturday(countType) {
    if (countType === 'created') {
      this._countCreatedOnSaturday += 1;
    } else {
      this._countMergedOnSaturday += 1;
    }
  }

  getMessage() {
    let message = this._getTotalsMessage();
    message += this._getAveragesMessage();
    message += this._getPercentsMessage();
    message += this._getIssuesMessage();

    return message;
  }

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

  _getAveragesMessage() {
    let message = '\t\t' + chalk.blue.bold('Average Age: ') + chalk.blue(prettyMs(this._calcAvg(this._sumOfAge))) + '\n';
    message += '\t\t' + chalk.blue.bold('Average number of commits: ') + chalk.blue(this._calcAvg(this._sumOfCommits)) + '\n';
    message += '\t\t' + chalk.blue.bold('Average number of tasks: ') + chalk.blue(this._sumOfTasks / this._count) + '\n\n';

    return message;
  }

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

  _getIssuesMessage() {
    return '\t\t' + chalk.cyan.bold('Issues Resolved: ') + chalk.cyan(this._issueKeys) + '\n';
  }

}

module.exports = PullRequestStats;
