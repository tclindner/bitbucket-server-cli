'use strict';

const Reporter = require('./Reporter');
const Harvester = require('./Harvester');
const Aggregator = require('./Aggregator');
const Config = require('./Config');

class PullRequestStatsPlugin {

  /**
   * Creates an instance of PullRequestStatsPlugin.
   * @param {Object} bitbucketApi BitbucketAPI object
   * @memberof PullRequestStatsPlugin
   */
  constructor(bitbucketApi) {
    this.pullRequestStatsConfig = Config.getConfig();
    this.bitbucketApi = bitbucketApi;

    this.harvester = new Harvester(bitbucketApi, this.pullRequestStatsConfig.startDate, this.pullRequestStatsConfig.endDate);
  }

  /**
   * Executes the plugin
   *
   * @returns {Promise} A promise is return that will resolve when the plugin is done executing
   * @memberof PullRequestStatsPlugin
   */
  execute() {
    return new Promise((resolve, reject) => {
      const promises = [];

      for (const project in this.pullRequestStatsConfig.projects) {
        promises.push(this.harvester.harvestProject(this.pullRequestStatsConfig.projects[project]));
      }

      Promise.all(promises).then(() => {
        const pullRequests = this.harvester.getPullRequests();
        const aggregator = new Aggregator();

        aggregator.aggregate(pullRequests);
        Reporter.write(aggregator.getOverallStats(), 'overall');
        Reporter.write(aggregator.getProjectStats(), 'project');
        Reporter.write(aggregator.getRepoStats(), 'repo');
        resolve('Pull Request Stats Plugin Completed Successfully');
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

}

module.exports = PullRequestStatsPlugin;
