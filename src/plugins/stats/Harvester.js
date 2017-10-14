'use strict';

/* eslint prefer-template: 'off', id-length: 'off' */

const chalk = require('chalk');
const PullRequest = require('./PullRequest');
const notFound = -1;

class Harvester {

  /**
   * Creates an instance of Harvester.
   * @param {Object} bitbucketApi Bitbucket API object
   * @param {String} startDate Date as a string (MM/DD/YYYY)
   * @param {String} endDate Date as a string (MM/DD/YYYY)
   * @memberof Harvester
   */
  constructor(bitbucketApi, startDate, endDate) {
    this.bitbucketApi = bitbucketApi;
    this.pullRequests = [];
    this.startDate = startDate;
    this.endDate = endDate;
    this.startDateInMillisecs = new Date(startDate).getTime();
    this.endDateInMillisecs = new Date(endDate).getTime();
  }

  /**
   * Harvest a project
   *
   * @param {Object} project Bitbucket project
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestProject(project) {
    const projectPromises = [];

    projectPromises.push(this.processProjectRepos(project));

    return Promise.all(projectPromises);
  }

  /**
   * Process project repos
   *
   * @param {Object} project Bitbucket project
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApi.retrieveRepositories(project.key).then((repos) => {
        this.harvestProjectRepos(project, repos).then(function() {
          console.log(chalk.green(chalk.bold(project.key) + ' project harvest complete'));
          resolve();
        });
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Harvest project repos
   *
   * @param {Object} project Bitbucket project
   * @param {Array} repos Array of repos
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestProjectRepos(project, repos) {
    const repoPromises = [];

    repos.forEach((repo) => {
      if (project.excludedrepos.indexOf(repo.slug) === notFound) {
        repoPromises.push(this.harvestRepo(project, repo));
      }
    });

    return Promise.all(repoPromises);
  }

  /**
   * Harvest a repo
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestRepo(project, repo) {
    const repoPromises = [];

    repoPromises.push(this.harvestPullRequests(project, repo));

    return Promise.all(repoPromises);
  }

  /**
   * Harvest a pull request
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestPullRequests(project, repo) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApi.retrievePullRequests(repo.project.key, repo.slug, 'MERGED').then((pullRequests) => {
        this.processPullRequests(project, repo, pullRequests).then(function() {
          resolve();
        });
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Process pull request
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Array} pullRequests Array of pull requests
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  processPullRequests(project, repo, pullRequests) {
    const pullRequestPromises = [];

    for (const pullRequest of pullRequests) {
      if (pullRequest.updatedDate >= this.startDateInMillisecs && pullRequest.updatedDate <= this.endDateInMillisecs) {
        pullRequestPromises.push(this.processPullRequest(project, repo, pullRequest));
      }
    }

    return Promise.all(pullRequestPromises);
  }

  /**
   * Process pull request
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Object} pullRequest Pull request
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  processPullRequest(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.retrievePullRequestDetails(project, repo, pullRequest).then((values) => {
        const pullRequestObj = new PullRequest(project.key, repo.slug, pullRequest);

        const pullRequestCommits = values[0];

        pullRequestObj.addCommitCount(pullRequestCommits);

        const pullRequestTaskCount = values[1];

        pullRequestObj.addTaskCount(pullRequestTaskCount);

        const pullRequestIssues = values[2];

        for (const pullRequestIssue of pullRequestIssues) {
          pullRequestObj.addIssue(pullRequestIssue.key);
        }

        this.pullRequests.push(pullRequestObj);
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Retrieve pull request details
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Object} pullRequest Pull request
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  retrievePullRequestDetails(project, repo, pullRequest) {
    const pullRequestDetailsPromises = [];

    pullRequestDetailsPromises.push(this.retrievePullRequestCommits(project, repo, pullRequest));
    pullRequestDetailsPromises.push(this.retrievePullRequestTaskCount(project, repo, pullRequest));
    pullRequestDetailsPromises.push(this.retrievePullRequestIssues(project, repo, pullRequest));

    return Promise.all(pullRequestDetailsPromises);
  }

  /**
   * Retrieve pull request commits
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Object} pullRequest Pull request
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  retrievePullRequestCommits(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucketApi.retrievePullRequestCommits(repo.project.key, repo.slug, pullRequest.id).then((pullRequestCommits) => {
        resolve(pullRequestCommits.length);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  /**
   * Retrieve pull request task count
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Object} pullRequest Pull request
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  retrievePullRequestTaskCount(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucketApi.retrievePullRequestTaskCount(repo.project.key, repo.slug, pullRequest.id).then((pullRequestTaskCount) => {
        resolve(pullRequestTaskCount.resolved);
      }).catch(function(error) {
        console.log(error);
        reject(error);
      });
    });
  }

  /**
   * Fetch pull request issues from API
   *
   * @param {Object} project Bitbucket project
   * @param {Object} repo Bitbucket repo
   * @param {Object} pullRequest Pull request
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  retrievePullRequestIssues(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucketApi.retrievePullRequestIssues(repo.project.key, repo.slug, pullRequest.id).then((pullRequestIssues) => {
        resolve(pullRequestIssues);
      }).catch(function(error) {
        console.log(error);
        reject(error);
      });
    });
  }

  /**
   * Get the array of pull requests
   *
   * @returns {Array} Array of pull requests
   * @memberof Harvester
   */
  getPullRequests() {
    return this.pullRequests;
  }

}

module.exports = Harvester;
