'use strict';

const fs = require('fs');

class FileHelper {

  static readJsonFile(filePath) {
    const file = fs.readFileSync(filePath);

    return JSON.parse(file);
  }

}

module.exports = FileHelper;
