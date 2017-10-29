'use strict';

const chalk = require('chalk');
const dateparser = require('dateparser');
const PullRequest = require('./PullRequest');
const notFound = -1;

class Auditor {

  /**
   * Creates an instance of Auditor.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {Object} definitionOfStale
   * @memberof Auditor
   */
  constructor(bitbucketApiClient, definitionOfStale) {
    this.bitbucketApiClient = bitbucketApiClient;
    this.definitionOfStale = definitionOfStale;
  }

  /**
   * Audit a project
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  auditProject(project) {
    return this._processProjectRepos(project);
  }

  /**
   * Process project repos
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepos(project.key).then((repos) => {
        this._auditProjectRepos(project, repos).then((arrayOfPullRequestObjs) => {
          console.log(chalk.green(chalk.bold(project.key) + ' project audit complete'));
          resolve(arrayOfPullRequestObjs);
        }).catch((error) => {
          reject(new Error(error));
        });
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Audit project repos
   *
   * @param {Object} project Project configuration from config file.
   * @param {Array} repos Array of repos
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _auditProjectRepos(project, repos) {
    return new Promise((resolve, reject) => {
      const repoPromises = [];

      repos.forEach((repo) => {
        if (project.excludedRepos.indexOf(repo.slug) === notFound) {
          repoPromises.push(this._auditRepo(project, repo));
        }
      });

      Promise.all(repoPromises).then((arrayOfArrayOfPullRequestObjs) => {
        const arrayOfPullRequestObjs = [].concat.apply([], arrayOfArrayOfPullRequestObjs);

        resolve(arrayOfPullRequestObjs);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Audit a repo
   *
   * @param {Object} project Project configuration from config file.
   * @param {Object} repo Bitbucket repo
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _auditRepo(project, repo) {
    return this._getPullRequests(project, repo);
  }

  /**
   * Get pull requests for a repo
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _getPullRequests(project, repo) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient._getPullRequests(repo.project.key, repo.slug).then((pullRequests) => {
        resolve(this._auditPullRequest(project, repo, pullRequests));
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Audits a pull request
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Object} pullRequest Pull request
   * @returns {Array} An array of pull request objects
   * @memberof Auditor
   */
  _auditPullRequest(project, repo, pullRequests) {
    const repoName = repo.hasOwnProperty('slug') ? repo.slug : '';
    const definitionOfStale = project.hasOwnProperty('definitionOfStale') ? project.definitionOfStale : this.definitionOfStale;
    const allowedAgeInMillisecs = dateparser.parse(definitionOfStale).value;
    const stalePrs = [];

    for (const pullRequest of pullRequests) {
      const age = (this._getTodaysDate() - pullRequest.updatedDate);

      if (age > allowedAgeInMillisecs) {
        const stalePr = new PullRequest(project.key, repoName, pullRequest);

        stalePrs.push(stalePr);
      }
    }

    return stalePrs;
  }

  /**
   * Get the current timestamp
   *
   * @returns
   * @memberof Auditor
   */
  _getTodaysDate() {
    return new Date().getTime();
  }

}

module.exports = Auditor;
