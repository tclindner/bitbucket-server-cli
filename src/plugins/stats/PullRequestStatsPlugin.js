'use strict';

/* eslint id-length: 'off' */
const chalk = require('chalk');
const Reporter = require('./Reporter');
const Harvester = require('./Harvester');
const Aggregator = require('./Aggregator');
const Config = require('./Config');

class PullRequestStatsPlugin {

  /**
   * Creates an instance of PullRequestStatsPlugin.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {object} options PullRequestStatsPlugin options
   * @memberof PullRequestStatsPlugin
   */
  constructor(bitbucketApiClient, options) {
    this.bitbucketApiClient = bitbucketApiClient;
    const config = Config.getOptions(options.startDate, options.endDate, options.relativeRange);

    this.startDate = config.startDate;
    this.endDate = config.endDate;
    this.projects = options.projects;
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
      const harvester = new Harvester(this.bitbucketApiClient, this.startDate, this.endDate);

      for (const project of this.projects) {
        promises.push(harvester.harvestProject(project));
      }

      Promise.all(promises).then((arrayOfArrayOfPullRequestObjs) => {
        const arrayOfPullRequestObjs = [].concat.apply([], arrayOfArrayOfPullRequestObjs);
        const aggregator = new Aggregator();

        aggregator.aggregate(arrayOfPullRequestObjs);

        const results = {
          overall: aggregator.getOverallStats(),
          projects: aggregator.getProjectStats(),
          repos: aggregator.getRepoStats()
        };

        Reporter.write(results.overall, 'overall');
        Reporter.write(results.projects, 'project');
        Reporter.write(results.repos, 'repo');

        console.log(chalk.bold.green('Pull Request Stats Plugin Completed Successfully'));

        resolve(results);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

}

module.exports = PullRequestStatsPlugin;
