'use strict';

const FileHelper = require('./../../FileHelper');
const path = require('path');
const userHome = require('user-home');
const configFileDirectoryName = 'bitbucket-server-cli';
const configFileName = 'permissionsConfig.json';

class Config {

  /**
   * Gets the configuration object for the plugin
   *
   * @static
   * @returns {Object} Configuration object for the plugin
   * @memberof Config
   */
  static getConfig() {
    try {
      const filePath = path.join(userHome, configFileDirectoryName, configFileName);

      return FileHelper.readJsonFile(filePath);
    } catch (e) {
      throw new Error(`You are missing a ${configFileName} file.`);
    }
  }

}

module.exports = Config;

