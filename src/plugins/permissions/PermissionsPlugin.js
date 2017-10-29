'use strict';

const Reporter = require('./Reporter');
const Validator = require('./Validator');
const Config = require('./Config');

/* eslint id-length: 'off' */

class PermissionsPlugin {

  /**
   * Creates an instance of PermissionsPlugin.
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @memberof PermissionsPlugin
   */
  constructor(bitbucketApiClient) {
    this.permissionConfig = Config.getConfig();
    this.bitbucketApiClient = bitbucketApiClient;
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
      const validator = new Validator(this.bitbucketApiClient);

      for (const project in this.permissionConfig) {
        promises.push(validator.validateProject(this.permissionConfig[project]));
      }

      Promise.all(promises).then((arrayOfArrayOfPermissionErrors) => {
        const arrayOfPermissionErrors = [].concat.apply([], arrayOfArrayOfPermissionErrors);

        Reporter.write(arrayOfPermissionErrors);
        resolve('Permissions Plugin Completed Successfully');
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

}

module.exports = PermissionsPlugin;
