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
      console.log(chalk.red.bold('Overall stats'));
      console.log(statsObjArray.overall.getMessage());
    } else if (statsType === 'project') {
      console.log(chalk.red.bold('Project level stats'));

      for (const projectKey in statsObjArray) {
        const currentProjectPrStats = statsObjArray[projectKey];

        console.log(`${chalk.magenta.bold('Project:')} ${chalk.magenta(projectKey)}`);
        console.log(currentProjectPrStats.getMessage());
      }
    } else {
      console.log(chalk.red.bold('Repo level stats'));

      for (const projectKey in statsObjArray) {
        const currentProjectPrStats = statsObjArray[projectKey];
        const keyParts = projectKey.split('|');
        const projectName = keyParts[0];
        const repoName = keyParts[1];

        console.log(`${chalk.magenta.bold('Project:')} ${chalk.magenta(projectName)}`);
        console.log(`${chalk.magenta.bold('Repo:')} ${chalk.magenta(repoName)}`);
        console.log(currentProjectPrStats.getMessage());
      }
    }
  }

}

module.exports = Reporter;
