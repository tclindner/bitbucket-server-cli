'use strict';

const chalk = require('chalk');
const Reporter = require('./Reporter');
const Validator = require('./Validator');

/* eslint id-length: 'off' */

class PermissionsPlugin {

  /**
   * Creates an instance of PermissionsPlugin.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {object} options StalePrsPlugin options
   * @memberof PermissionsPlugin
   */
  constructor(bitbucketApiClient, options) {
    this.bitbucketApiClient = bitbucketApiClient;
    this.options = options;
    this.projects = options.projects;
  }

  /**
   * Executes the plugin
   *
   * @returns {Promise} A promise is return that will resolve when the plugin is done executing
   * @memberof PermissionsPlugin
   */
  execute() {
    return new Promise((resolve, reject) => {
      const promises = [];
      const validator = new Validator(this.bitbucketApiClient, this.options);

      for (const project of this.projects) {
        promises.push(validator.validateProject(project));
      }

      Promise.all(promises).then((arrayOfArrayOfPermissionErrors) => {
        const arrayOfPermissionErrors = [].concat.apply([], arrayOfArrayOfPermissionErrors);

        Reporter.write(arrayOfPermissionErrors);

        console.log(chalk.bold.green('Permissions Plugin Completed Successfully'));

        resolve(arrayOfPermissionErrors);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

}

module.exports = PermissionsPlugin;
