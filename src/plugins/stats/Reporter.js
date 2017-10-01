"use strict";

let chalk = require("chalk");

class Reporter {
  static write(statsObjArray, statsType) {
    if (statsType === "overall") {
      console.log(chalk.red.bold("Overall stats"));
      console.log(statsObjArray.overall.getMessage());
    } else if (statsType === "project") {
      console.log(chalk.red.bold("Project level stats"));

      for (let projectKey in statsObjArray) {
        let currentProjectPullRequestStats = statsObjArray[projectKey];
        console.log("\t" + chalk.magenta.bold("Project: ") + chalk.magenta(projectKey));
        console.log(currentProjectPullRequestStats.getMessage());
      }
    } else {
      console.log(chalk.red.bold("Repo level stats"));

      for (let projectKey in statsObjArray) {
        let currentProjectPullRequestStats = statsObjArray[projectKey];
        let keyParts = projectKey.split("|");
        let projectName = keyParts[0];
        let repoName = keyParts[1];
        console.log("\t" + chalk.magenta.bold("Project: ") + chalk.magenta(projectName));
        console.log("\t" + chalk.magenta.bold("Repo: ") + chalk.magenta(repoName));
        console.log(currentProjectPullRequestStats.getMessage());
      }
    }
  }
}

module.exports = Reporter;
