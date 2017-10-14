'use strict';

const fs = require('fs');

class FileHelper {

  /**
   * Reads JSON files and parses them as an object
   *
   * @static
   * @param {String} filePath Path to file including the file name
   * @returns {Object} JavaScript Object
   * @memberof FileHelper
   */
  static readJsonFile(filePath) {
    const file = fs.readFileSync(filePath);

    return JSON.parse(file);
  }

}

module.exports = FileHelper;
