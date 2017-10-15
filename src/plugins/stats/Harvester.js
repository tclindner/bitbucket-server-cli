'use strict';

/* eslint prefer-template: 'off', id-length: 'off' */

const chalk = require('chalk');
const PullRequest = require('./PullRequest');
const notFound = -1;

class Harvester {

  /**
   * Creates an instance of Harvester.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {String} startDate Date as a string (MM/DD/YYYY)
   * @param {String} endDate Date as a string (MM/DD/YYYY)
   * @memberof Harvester
   */
  constructor(bitbucketApiClient, startDate, endDate) {
    this.bitbucketApiClient = bitbucketApiClient;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startDateInMillisecs = new Date(startDate).getTime();
    this.endDateInMillisecs = new Date(endDate).getTime();
  }

  /**
   * Harvest a project
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestProject(project) {
    return this.processProjectRepos(project);
  }

  /**
   * Process project repos
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepos(project.key).then((repos) => {
        this.harvestProjectRepos(project, repos).then((arrayOfPullRequestObjs) => {
          console.log(chalk.green(chalk.bold(project.key) + ' project harvest complete'));
          resolve(arrayOfPullRequestObjs);
        });
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Harvest project repos
   *
   * @param {Object} project Project configuration from config file.
   * @param {Array} repos Array of repos
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestProjectRepos(project, repos) {
    return new Promise((resolve, reject) => {
      const repoPromises = [];

      repos.forEach((repo) => {
        if (project.excludedrepos.indexOf(repo.slug) === notFound) {
          repoPromises.push(this.harvestRepo(project, repo));
        }
      });

      return Promise.all(repoPromises).then((arrayOfArrayOfPullRequestObjs) => {
        const arrayOfPullRequestObjs = [].concat.apply([], arrayOfArrayOfPullRequestObjs);

        resolve(arrayOfPullRequestObjs);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Harvest a repo
   *
   * @param {Object} project Project configuration from config file.
   * @param {Object} repo Bitbucket repo
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Harvester
   */
  harvestRepo(project, repo) {
    return this.harvestPullRequests(project, repo);
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
      this.bitbucketApiClient.getPullRequests(repo.project.key, repo.slug, 'MERGED').then((pullRequests) => {
        this.processPullRequests(project, repo, pullRequests).then(function(arrayOfPullRequestObjs) {
          resolve(arrayOfPullRequestObjs);
        });
      }).catch(function(error) {
        reject(new Error(error));
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
    return new Promise((resolve, reject) => {
      const pullRequestPromises = [];

      for (const pullRequest of pullRequests) {
        if (pullRequest.updatedDate >= this.startDateInMillisecs && pullRequest.updatedDate <= this.endDateInMillisecs) {
          pullRequestPromises.push(this.processPullRequest(project, repo, pullRequest));
        }
      }

      Promise.all(pullRequestPromises).then((arrayOfPullRequestObjs) => {
        resolve(arrayOfPullRequestObjs);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
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
        const pullRequestTaskCount = values[1];
        const pullRequestIssues = values[2];

        pullRequestObj.addCommitCount(pullRequestCommits);
        pullRequestObj.addTaskCount(pullRequestTaskCount);

        for (const pullRequestIssue of pullRequestIssues) {
          pullRequestObj.addIssue(pullRequestIssue.key);
        }

        resolve(pullRequestObj);
      }).catch(function(error) {
        reject(new Error(error));
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

    pullRequestDetailsPromises.push(this.getPullRequestCommits(project, repo, pullRequest));
    pullRequestDetailsPromises.push(this.getPullRequestTaskCount(project, repo, pullRequest));
    pullRequestDetailsPromises.push(this.getPullRequestIssues(project, repo, pullRequest));

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
  getPullRequestCommits(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getPullRequestCommits(repo.project.key, repo.slug, pullRequest.id).then((pullRequestCommits) => {
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
  getPullRequestTaskCount(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getPullRequestTaskCount(repo.project.key, repo.slug, pullRequest.id).then((pullRequestTaskCount) => {
        resolve(pullRequestTaskCount.resolved);
      }).catch(function(error) {
        reject(new Error(error));
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
  getPullRequestIssues(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getPullRequestIssues(repo.project.key, repo.slug, pullRequest.id).then((pullRequestIssues) => {
        resolve(pullRequestIssues);
      }).catch(function(error) {
        reject(new Error(error));
      });
    });
  }

}

module.exports = Harvester;
