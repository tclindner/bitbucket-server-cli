'use strict';

const chalk = require('chalk');
const oneError = 1;

/* eslint max-statements: 'off' */

class Reporter {

  /**
   * Writes to console
   *
   * @static
   * @param {Array} errors An array of PermissionError objects
   * @return {Undefined} No return
   * @memberof Reporter
   */
  static write(errors) {
    const errorCount = errors.length;

    if (errorCount) {
      for (const error of errors) {
        console.log(error.getMessage());
      }

      console.log(`${chalk.red.bold(errorCount)} permission ${errorCount === oneError ? 'error' : 'errors'} found.`);
    } else {
      console.log(chalk.green.bold('No permission errors found!'));
    }
  }

}

module.exports = Reporter;
