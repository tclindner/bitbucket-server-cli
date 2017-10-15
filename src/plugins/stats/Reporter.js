'use strict';

const chalk = require('chalk');

/* eslint max-statements: 'off' */

class Reporter {

  /**
   * Writes to console
   *
   * @static
   * @param {Array} statsObjArray An array of stats objects
   * @param {String} statsType The type of stat being processed
   * @return {Undefined} No return
   * @memberof Reporter
   */
  static write(statsObjArray, statsType) {
    if (statsType === 'overall') {
      console.log(chalk.bgWhite.black('Overall stats'));
      console.log(statsObjArray.overall.getMessage());
    } else if (statsType === 'project') {
      console.log(chalk.bgWhite.black('Project level stats'));

      for (const projectKey in statsObjArray) {
        const currentProjectPrStats = statsObjArray[projectKey];

        console.log(`${chalk.white.bold('Project:')} ${chalk.white(projectKey)}`);
        console.log(currentProjectPrStats.getMessage());
      }
    } else {
      console.log(chalk.bgWhite.black('Repo level stats'));

      for (const projectKey in statsObjArray) {
        const currentProjectPrStats = statsObjArray[projectKey];
        const keyParts = projectKey.split('|');
        const projectName = keyParts[0];
        const repoName = keyParts[1];

        console.log(`${chalk.white.bold('Project:')} ${chalk.white(projectName)}`);
        console.log(`${chalk.white.bold('Repo:')} ${chalk.white(repoName)}`);
        console.log(currentProjectPrStats.getMessage());
      }
    }
  }

}

module.exports = Reporter;
