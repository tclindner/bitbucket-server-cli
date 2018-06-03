'use strict';

const Reporter = require('./Reporter');
const Auditor = require('./Auditor');

/* eslint id-length: 'off' */

class StalePrs {

  /**
   * Creates an instance of StalePrs.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {object} options StalePrsPlugin options
   * @memberof StalePrsPlugin
   */
  constructor(bitbucketApiClient, options) {
    this.bitbucketApiClient = bitbucketApiClient;
    this.definitionOfStale = options.definitionOfStale;
    this.projects = options.projects;
  }

  /**
   * Executes the plugin
   *
   * @returns {Promise} A promise is return that will resolve when the plugin is done executing
   * @memberof StalePrsPlugin
   */
  execute() {
    return new Promise((resolve, reject) => {
      const promises = [];
      const auditor = new Auditor(this.bitbucketApiClient, this.definitionOfStale);

      for (const project of this.projects) {
        promises.push(auditor.auditProject(project));
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
