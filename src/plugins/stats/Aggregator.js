'use strict';

/* eslint max-params: 'off', no-negated-condition: 'off'  */
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
   * @param {Array} pullRequests An array of pull requests
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

  /**
   * Update overall PR stats
   *
   * @param {String} key Key identifying the stats
   * @param {Number} age Age of the PR
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @param {Number} commitCount Number of commmits
   * @param {Number} taskCount Number of tasks
   * @param {String} issueKeys JIRA issues resolved
   * @memberof Aggregator
   */
  _updateOverallStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._overallStats.hasOwnProperty(key)) {
      const pullRequestStats = new PullRequestStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);

      this._overallStats[key] = pullRequestStats;
    } else {
      const pullRequestStats = this._overallStats[key];

      pullRequestStats.updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._overallStats[key] = pullRequestStats;
    }
  }

  /**
   * Update project stats
   *
   * @param {String} key Key identifying the stats
   * @param {Number} age Age of the PR
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @param {Number} commitCount Number of commmits
   * @param {Number} taskCount Number of tasks
   * @param {String} issueKeys JIRA issues resolved
   * @memberof Aggregator
   */
  _updateProjectStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._projectStats.hasOwnProperty(key)) {
      const pullRequestStats = new PullRequestStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);

      this._projectStats[key] = pullRequestStats;
    } else {
      const pullRequestStats = this._projectStats[key];

      pullRequestStats.updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._projectStats[key] = pullRequestStats;
    }
  }

  /**
   * Update repo stats
   *
   * @param {String} key Key identifying the stats
   * @param {Number} age Age of the PR
   * @param {Number} createdWeekDay JavaScript's number representation of the day of the week the PR was created.
   * @param {Number} mergedWeekDay JavaScript's number representation of the day of the week the PR was merged.
   * @param {Number} commitCount Number of commmits
   * @param {Number} taskCount Number of tasks
   * @param {String} issueKeys JIRA issues resolved
   * @memberof Aggregator
   */
  _updateRepoStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._repoStats.hasOwnProperty(key)) {
      const pullRequestStats = new PullRequestStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);

      this._repoStats[key] = pullRequestStats;
    } else {
      const pullRequestStats = this._repoStats[key];

      pullRequestStats.updateStats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._repoStats[key] = pullRequestStats;
    }
  }

  /**
   * Gets overall stats
   *
   * @returns {Object} Overall pull request stats
   * @memberof Aggregator
   */
  getOverallStats() {
    return this._overallStats;
  }

  /**
   * Get project stats
   *
   * @returns {Object} Project pull request stats
   * @memberof Aggregator
   */
  getProjectStats() {
    return this._projectStats;
  }

  /**
   * Get repo stats
   *
   * @returns {Object} Repo pull request stats
   * @memberof Aggregator
   */
  getRepoStats() {
    return this._repoStats;
  }

}

module.exports = Aggregator;
