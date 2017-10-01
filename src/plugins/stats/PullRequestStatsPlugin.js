'use strict';

const chalk = require('chalk');
const Reporter = require('./Reporter');
const Harvester = require('./Harvester');
const Aggregator = require('./Aggregator');
const Config = require('./Config');

class PullRequestStatsPlugin {
  constructor(bitbucketApi) {
    this.pullRequestStatsConfig = Config.getConfig();
    this.bitbucketApi = bitbucketApi;

    this.harvester = new Harvester(bitbucketApi, this.pullRequestStatsConfig.startDate, this.pullRequestStatsConfig.endDate);
  }

  execute() {
    return new Promise((resolve, reject) => {
      let promises = [];

      for (let project in this.pullRequestStatsConfig.projects) {
        promises.push(this.harvester.harvestProject(this.pullRequestStatsConfig.projects[project]));
      }

      Promise.all(promises).then((results) => {
        let pullRequests = this.harvester.getPullRequests();
        let aggregator = new Aggregator();
        aggregator.aggregate(pullRequests);
        Reporter.write(aggregator.getOverallStats(), 'overall');
        Reporter.write(aggregator.getProjectStats(), 'project');
        Reporter.write(aggregator.getRepoStats(), 'repo');
        console.log(chalk.green.bold('Pull Request Stats Plugin Completed Successfully'));
        resolve();
      }).catch((error) => {
        console.log(error);
        reject();
      });
    });
  }
}

module.exports = PullRequestStatsPlugin;
