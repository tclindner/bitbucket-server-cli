'use strict';

const chalk = require('chalk');
const dateparser = require('dateparser');
const PullRequest = require('./PullRequest');

/* eslint id-length: 'off', max-params: 'off', class-methods-use-this: 'off' */

class Auditor {

  /**
   * Creates an instance of Auditor.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {Object} definitionOfStale Definition of stale configuration object
   * @memberof Auditor
   */
  constructor(bitbucketApiClient, definitionOfStale) {
    this.bitbucketApiClient = bitbucketApiClient;
    this.definitionOfStale = definitionOfStale;
  }

  /**
   * Audit a project
   *
   * @param {string} project Bitbucket project key.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  auditProject(project) {
    return this._processProjectRepos(project);
  }

  /**
   * Process project repos
   *
   * @param {string} project Bitbucket project key.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepos(project).then((repos) => {
        this._auditProjectRepos(project, repos).then((arrayOfPullRequestObjs) => {
          console.log(chalk.green(`${chalk.bold(project)} project audit complete`));
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
   * @param {string} project Bitbucket project key.
   * @param {Array} repos Array of repos
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _auditProjectRepos(project, repos) {
    return new Promise((resolve, reject) => {
      const repoPromises = [];

      repos.forEach((repo) => {
        repoPromises.push(this._auditRepo(project, repo));
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
   * @param {string} project Bitbucket project key.
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
   * @param {string} project Bitbucket project key.
   * @param {Object} repo Bitbucket repo
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Auditor
   */
  _getPullRequests(project, repo) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getPullRequests(repo.project.key, repo.slug).then((pullRequests) => {
        resolve(this._auditPullRequest(project, repo, pullRequests));
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Audits a pull request
   *
   * @param {string} project Bitbucket project key.
   * @param {Object} repo Bitbucket repo
   * @param {Array} pullRequests Array of pull request objects
   * @returns {Array} An array of pull request objects
   * @memberof Auditor
   */
  _auditPullRequest(project, repo, pullRequests) {
    const repoName = repo.hasOwnProperty('slug') ? repo.slug : '';
    const allowedAgeInMillisecs = dateparser.parse(this.definitionOfStale).value;
    const stalePrs = [];

    for (const pullRequest of pullRequests) {
      const age = this._getTodaysDate() - pullRequest.updatedDate;

      if (age > allowedAgeInMillisecs) {
        const stalePr = new PullRequest(project, repoName, pullRequest);

        stalePrs.push(stalePr);
      }
    }

    return stalePrs;
  }

  /**
   * Get the current timestamp
   *
   * @returns {Number} Timestamp
   * @memberof Auditor
   */
  _getTodaysDate() {
    return new Date().getTime();
  }

}

module.exports = Auditor;
