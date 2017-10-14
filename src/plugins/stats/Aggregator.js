'use strict';

const PullRequestStats = require('./PullRequestStats');

class Aggregator {

  /**
   * Creates an instance of Aggregator.
   * @memberof Aggregator
   */
  constructor() {
    this._overallStats = {};
    this._projectStats = {};
    this._repoStats = {};
  }

  /**
   * Aggregates a set of pull requests
   *
   * @param {Array} pullRequests
   * @return {undefined} No return
   * @memberof Aggregator
   */
  aggregate(pullRequests) {
    for (const pullRequest of pullRequests) {
      const projectName = pullRequest.getProject();
      const repoName = pullRequest.getRepo();
      const age = pullRequest.getAge();
      const createdWeekDay = pullRequest.getCreatedWeekDay();
      const mergedWeekDay = pullRequest.getMergedWeekDay();
      const commitCount = pullRequest.getCommitCount();
      const taskCount = pullRequest.getTaskCount();
      const issueKeys = pullRequest.getIssues();

      this._updateOverallStats('overall', age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._updateProjectStats(projectName, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._updateRepoStats(`${projectName}|${repoName}`, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
    }
  }

  _updateOverallStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._overallStats.hasOwnProperty(key)) {
      let pullRequestStats = new PullRequestStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._overallStats[key] = pullRequestStats;
    } else {
      let pullRequestStats = this._overallStats[key];
      pullRequestStats.updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._overallStats[key] = pullRequestStats;
    }
  }

  _updateProjectStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._projectStats.hasOwnProperty(key)) {
      let pullRequestStats = new PullRequestStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._projectStats[key] = pullRequestStats;
    } else {
      let pullRequestStats = this._projectStats[key];
      pullRequestStats.updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._projectStats[key] = pullRequestStats;
    }
  }

  _updateRepoStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._repoStats.hasOwnProperty(key)) {
      let pullRequestStats = new PullRequestStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._repoStats[key] = pullRequestStats;
    } else {
      let pullRequestStats = this._repoStats[key];
      pullRequestStats.updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._repoStats[key] = pullRequestStats;
    }
  }

  getOverallStats() {
    return this._overallStats;
  }

  getProjectStats() {
    return this._projectStats;
  }

  getRepoStats() {
    return this._repoStats;
  }
}

module.exports = Aggregator;
