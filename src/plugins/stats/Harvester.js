'use strict';

let chalk = require('chalk');
let dateparser = require('dateparser');
let PullRequest = require('./PullRequest');

class Harvester {
  constructor(bitbucket, startDate, endDate) {
    this.bitbucket = bitbucket;
    this.pullRequests = [];
    this.startDate = startDate;
    this.endDate = endDate;
    this.startDateInMillisecs = new Date(startDate).getTime();
    this.endDateInMillisecs = new Date(endDate).getTime();
  }

  harvestProject(project) {
    let projectPromises = [];

    projectPromises.push(this.processProjectRepos(project));

    return Promise.all(projectPromises);
  }

  processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucket.retrieveRepositories(project.key).then((repos) => {
        this.harvestProjectRepos(project, repos).then(function() {
          console.log(chalk.green(chalk.bold(project.key) + ' project harvest complete'));
          resolve();
        });
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  harvestProjectRepos(project, repos) {
    let repoPromises = [];

    repos.forEach((repo) => {
      if (project.excludedrepos.indexOf(repo.slug) === -1) {
        repoPromises.push(this.harvestRepo(project, repo));
      }
    });

    return Promise.all(repoPromises);
  }

  harvestRepo(project, repo) {
    let repoPromises = [];

    repoPromises.push(this.harvestPullRequests(project, repo));

    return Promise.all(repoPromises);
  }

  harvestPullRequests(project, repo) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucket.retrievePullRequests(repo.project.key, repo.slug, 'MERGED').then((pullRequests) => {
        this.processPullRequests(project, repo, pullRequests).then(function() {
          resolve();
        });
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  processPullRequests(project, repo, pullRequests) {
    let pullRequestPromises = [];

    for (let pullRequest of pullRequests) {
      if (pullRequest.updatedDate >= this.startDateInMillisecs && pullRequest.updatedDate <= this.endDateInMillisecs) {
        pullRequestPromises.push(this.processPullRequest(project, repo, pullRequest));
      }
    }

    return Promise.all(pullRequestPromises);
  }

  processPullRequest(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.retrievePullRequestDetails(project, repo, pullRequest).then((values) => {
        let pullRequestObj = new PullRequest(project.key, repo.slug, pullRequest);

        let pullRequestCommits = values[0];
        pullRequestObj.addCommitCount(pullRequestCommits);

        let pullRequestTaskCount = values[1];
        pullRequestObj.addTaskCount(pullRequestTaskCount);

        let pullRequestIssues = values[2];

        for (let pullRequestIssue of pullRequestIssues) {
          pullRequestObj.addIssue(pullRequestIssue.key);
        }

        this.pullRequests.push(pullRequestObj);
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  retrievePullRequestDetails(project, repo, pullRequest) {
    let pullRequestDetailsPromises = [];

    pullRequestDetailsPromises.push(this.retrievePullRequestCommits(project, repo, pullRequest));
    pullRequestDetailsPromises.push(this.retrievePullRequestTaskCount(project, repo, pullRequest));
    pullRequestDetailsPromises.push(this.retrievePullRequestIssues(project, repo, pullRequest));

    return Promise.all(pullRequestDetailsPromises);
  }

  retrievePullRequestCommits(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucket.retrievePullRequestCommits(repo.project.key, repo.slug, pullRequest.id).then((pullRequestCommits) => {
        resolve(pullRequestCommits.length);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  retrievePullRequestTaskCount(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucket.retrievePullRequestTaskCount(repo.project.key, repo.slug, pullRequest.id).then((pullRequestTaskCount) => {
        resolve(pullRequestTaskCount.resolved);
      }).catch(function(error) {
        console.log(error);
        reject(error);
      });
    });
  }

  retrievePullRequestIssues(project, repo, pullRequest) {
    return new Promise((resolve, reject) => {
      this.bitbucket.retrievePullRequestIssues(repo.project.key, repo.slug, pullRequest.id).then((pullRequestIssues) => {
        resolve(pullRequestIssues);
      }).catch(function(error) {
        console.log(error);
        reject(error);
      });
    });
  }

  getPullRequests() {
    return this.pullRequests;
  }
}

module.exports = Harvester;
