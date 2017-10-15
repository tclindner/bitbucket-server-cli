'use strict';

const Reporter = require('./Reporter');
const Harvester = require('./Harvester');
const Aggregator = require('./Aggregator');
const Config = require('./Config');

class PullRequestStatsPlugin {

  /**
   * Creates an instance of PullRequestStatsPlugin.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @memberof PullRequestStatsPlugin
   */
  constructor(bitbucketApiClient) {
    this.pullRequestStatsConfig = Config.getConfig();
    this.bitbucketApiClient = bitbucketApiClient;
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
      const harvester = new Harvester(bitbucketApiClient, this.pullRequestStatsConfig.startDate, this.pullRequestStatsConfig.endDate);


      for (const project in this.pullRequestStatsConfig.projects) {
        promises.push(harvester.harvestProject(this.pullRequestStatsConfig.projects[project]));
      }

      Promise.all(promises).then((arrayOfArrayOfPullRequestObjs) => {
        const arrayOfPullRequestObjs = [].concat.apply([], arrayOfArrayOfPullRequestObjs);
        const aggregator = new Aggregator();

        aggregator.aggregate(arrayOfPullRequestObjs);
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
