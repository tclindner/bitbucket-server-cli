'use strict';

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
    this._createdWeekDay = new Date(pullRequest.createdDate).getDay();
    this._mergedWeekDay = new Date(pullRequest.updatedDate).getDay();
    this._age = pullRequest.updatedDate - pullRequest.createdDate;
    this._commitCount = 0;
    this._taskCount = 0;
    this._issues = '';
  }

  /**
   * Add the number of commits
   *
   * @param {Number} count Number of commits
   * @returns {Undefined} No return
   * @memberof PullRequest
   */
  addCommitCount(count) {
    this._commitCount = count;
  }

  /**
   * Add the number of tasks
   *
   * @param {Number} count Number of tasks
   * @returns {Undefined} No return
   * @memberof PullRequest
   */
  addTaskCount(count) {
    this._taskCount = count;
  }

  /**
   * Add a JIRA issue that was closed by the PR
   *
   * @param {String} issueKey The JIRA issue key
   * @returns {Undefined} No return
   * @memberof PullRequest
   */
  addIssue(issueKey) {
    if (this._issues === '') {
      this._issues = issueKey;
    } else {
      this._issues += `, ${issueKey}`;
    }
  }

  /**
   * Get the Bitbucket project slug
   *
   * @returns {String} Bitbucket project slug
   * @memberof PullRequest
   */
  getProject() {
    return this._project;
  }

  /**
   * Get the Bitbucket repo slug
   *
   * @returns {String} Bitbucket repo slug
   * @memberof PullRequest
   */
  getRepo() {
    return this._repo;
  }

  /**
   * Get the age of the pull request
   *
   * @returns {Number} Age of the pull request
   * @memberof PullRequest
   */
  getAge() {
    return this._age;
  }

  /**
   * Get the JavaScript's number representation of the day of the week the PR was created.
   *
   * @returns {Number} JavaScript's number representation of the day of the week the PR was created
   * @memberof PullRequest
   */
  getCreatedWeekDay() {
    return this._createdWeekDay;
  }

  /**
   * Get the JavaScript's number representation of the day of the week the PR was merged.
   *
   * @returns {Number} JavaScript's number representation of the day of the week the PR was merged
   * @memberof PullRequest
   */
  getMergedWeekDay() {
    return this._mergedWeekDay;
  }

  /**
   * Get the commit count
   *
   * @returns {Number} Commit count
   * @memberof PullRequest
   */
  getCommitCount() {
    return this._commitCount;
  }

  /**
   * Get the task count
   *
   * @returns {Number} Task count
   * @memberof PullRequest
   */
  getTaskCount() {
    return this._taskCount;
  }

  /**
   * Get a list of JIRA issues that were resolved by the pull request
   *
   * @returns {String} List of JIRA issues that were resolved by the pull request
   * @memberof PullRequest
   */
  getIssues() {
    return this._issues;
  }

}

module.exports = PullRequest;
