'use strict';

const chalk = require('chalk');
const oneError = 1;

class Reporter {

  /**
   * Writes to console
   *
   * @static
   * @param {Array} stalePrs An array of PullRequest objects
   * @returns {Unknown} No return
   * @memberof Reporter
   */
  static write(stalePrs) {
    const stalePrCount = stalePrs.length;

    if (stalePrCount) {
      for (const stalePr of stalePrs) {
        console.log(stalePr.getMessage());
      }

      console.log(`${chalk.red.bold(stalePrCount)} stale pull ${stalePrCount === oneError ? 'request' : 'requests'} found.`);
    } else {
      console.log(chalk.green.bold('No stale pull requests found!'));
    }
  }

}

module.exports = Reporter;
