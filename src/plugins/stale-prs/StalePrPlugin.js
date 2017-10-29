'use strict';

const chalk = require('chalk');
const Reporter = require('./Reporter');
const Auditor = require('./Auditor');
const Config = require('./Config');

class StalePrs {

  /**
   * Creates an instance of StalePrs.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @memberof StalePrs
   */
  constructor(bitbucketApiClient) {
    this.stalePrsConfig = Config.getConfig();
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
      const auditor = new Auditor(this.bitbucketApiClient, this.stalePrsConfig.definitionOfStale);

      for (const project in this.stalePrsConfig.projects) {
        promises.push(auditor.auditProject(this.stalePrsConfig.projects[project]));
      }

      Promise.all(promises).then((arrayOfArrayOfPullRequestObjects) => {
        const arrayOfPullRequestObjects = [].concat.apply([], arrayOfArrayOfPullRequestObjects);

        Reporter.write(arrayOfPullRequestObjects);

        resolve('Stale PRs Plugin Completed Successfully');
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }
}

module.exports = StalePrs;
