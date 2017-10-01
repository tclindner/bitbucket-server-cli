'use strict';

const chalk = require('chalk');
const moment = require('moment');

class PullRequest {
  constructor(project, repo, pullRequest) {
    this._project = project;
    this._repo = repo;
    this._id = pullRequest.id;
    this._createdWeekDay = new Date(pullRequest.createdDate).getDay();
    this._mergedWeekDay = new Date(pullRequest.updatedDate).getDay();
    this._age = pullRequest.updatedDate - pullRequest.createdDate;
    this._commitCount = 0;
    this._taskCount = 0;
    this._issues = '';
  }

  addCommitCount(count) {
    this._commitCount = count;
  }

  addTaskCount(count) {
    this._taskCount = count;
  }

  addIssue(issueKey) {
    if (this._issues === '') {
      this._issues = issueKey;
    } else {
      this._issues += `, ${issueKey}`;
    }
  }

  getProject() {
    return this._project;
  }

  getRepo() {
    return this._repo;
  }

  getAge() {
    return this._age;
  }

  getCreatedWeekDay() {
    return this._createdWeekDay;
  }

  getMergedWeekDay() {
    return this._mergedWeekDay;
  }

  getCommitCount() {
    return this._commitCount;
  }

  getTaskCount() {
    return this._taskCount;
  }

  getIssues() {
    return this._issues;
  }
}

module.exports = PullRequest;
