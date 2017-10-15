'use strict';

/* eslint max-params: 'off', no-negated-condition: 'off'  */
const Stats = require('./Stats');

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
   * @returns {Undefined} No return
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
   * @returns {Undefined} No return
   * @memberof Aggregator
   */
  _updateOverallStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._overallStats.hasOwnProperty(key)) {
      const stats = new Stats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);

      this._overallStats[key] = stats;
    } else {
      const stats = this._overallStats[key];

      stats.update(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._overallStats[key] = stats;
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
   * @returns {Undefined} No return
   * @memberof Aggregator
   */
  _updateProjectStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._projectStats.hasOwnProperty(key)) {
      const stats = new Stats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);

      this._projectStats[key] = stats;
    } else {
      const stats = this._projectStats[key];

      stats.update(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._projectStats[key] = stats;
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
   * @returns {Undefined} No return
   * @memberof Aggregator
   */
  _updateRepoStats(key, age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys) {
    if (!this._repoStats.hasOwnProperty(key)) {
      const stats = new Stats(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);

      this._repoStats[key] = stats;
    } else {
      const stats = this._repoStats[key];

      stats.update(age, createdWeekDay, mergedWeekDay, commitCount, taskCount, issueKeys);
      this._repoStats[key] = stats;
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
