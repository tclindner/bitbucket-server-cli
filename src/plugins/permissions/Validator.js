'use strict';

const chalk = require('chalk');
const PermissionError = require('./PermissionError');

class Validator {

  /**
   * Creates an instance of Validator.
   *
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @memberof Validator
   */
  constructor(bitbucketApiClient) {
    this.bitbucketApiClient = bitbucketApiClient;
  }

  /**
   * Validate a project
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateProject(project) {
    return new Promise((resolve, reject) => {
      const projectPromises = [];

      projectPromises.push(this.validateProjectGroupPermissions(project));
      projectPromises.push(this.validateProjectUserPermissions(project));
      projectPromises.push(this.processProjectRepos(project));

      Promise.all(projectPromises).then((arrayOfArrayOfPermissionErrors) => {
        console.log(chalk.green(chalk.bold(project.key) + ' project audit complete'));

        const arrayOfPermissionErrors = [].concat.apply([], arrayOfArrayOfPermissionErrors);

        resolve(arrayOfPermissionErrors);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Validate a project's group permissions
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateProjectGroupPermissions(project) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getProjectGroupPermissions(project.key).then((groups) => {
        resolve(this.auditPermissions(project, '', groups, 'Group', project.projectPermissions.groups));
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Validate a project's user permissions
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateProjectUserPermissions(project) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getProjectUserPermissions(project.key).then((users) => {
        resolve(this.auditPermissions(project, '', users, 'Users', project.projectPermissions.users));
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Process project repos
   *
   * @param {Object} project Project configuration from config file.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepos(project.key).then((repos) => {
        this.validateProjectRepos(project, repos).then((arrayOfPermissionErrors) => {
          resolve(arrayOfPermissionErrors);
        }).catch((error) => {
          reject(new Error(error));
        });
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Validate project repos
   *
   * @param {Object} project Project configuration from config file.
   * @param {Array} repos Array of repos
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateProjectRepos(project, repos) {
    return new Promise((resolve, reject) => {
      const repoPromises = [];

      repos.forEach((repo) => {
        repoPromises.push(this.validateRepo(project, repo));
      });

      Promise.all(repoPromises).then((arrayOfArrayOfPermissionErrors) => {
        const arrayOfPermissionErrors = [].concat.apply([], arrayOfArrayOfPermissionErrors);

        resolve(arrayOfPermissionErrors);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Validate project repo
   *
   * @param {Object} project Project configuration from config file.
   * @param {Object} repo Bitbucket repo object
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateRepo(project, repo) {
    return new Promise((resolve, reject) => {
      const repoPromises = [];

      repoPromises.push(this.validateRepoUserPermissions(project, repo));
      repoPromises.push(this.validateRepoGroupPermissions(project, repo));

      Promise.all(repoPromises).then((arrayOfArrayOfPermissionErrors) => {
        const arrayOfPermissionErrors = [].concat.apply([], arrayOfArrayOfPermissionErrors);

        resolve(arrayOfPermissionErrors);
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Validate a repo's group permissions
   *
   * @param {Object} project Project configuration from config file.
   * @param {Array} repo Bitbucket repo object
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateRepoGroupPermissions(project, repo) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepoGroupPermissions(repo.project.key, repo.slug).then((groups) => {
        resolve(this.auditPermissions(project, repo, groups, 'Group', project.repoPermissions.groups));
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Validate a repo's user permissions
   *
   * @param {Object} project Project configuration from config file.
   * @param {Array} repo Bitbucket repo object
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateRepoUserPermissions(project, repo) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepoUserPermissions(repo.project.key, repo.slug).then((users) => {
        resolve(this.auditPermissions(project, repo, users, 'Users', project.repoPermissions.users));
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Audit permissions
   *
   * @param {Object} project Project configuration from config file.
   * @param {Object} repo Bitbucket repo object
   * @param {Array} array An array of users or groups
   * @param {String} entityType Entity type of the array
   * @param {Array} validPermissions An array of valid permissions
   * @returns {Array} An array of PermissionError objects
   * @memberof Validator
   */
  auditPermissions(project, repo, array, entityType, validPermissions) {
    const repoName = repo.hasOwnProperty('slug') ? repo.slug : '';
    const errors = [];

    for (const arrayValue of array) {
      const isValidEntity = validPermissions.hasOwnProperty(this.getName(arrayValue, entityType));
      const isValidPermission = validPermissions[this.getName(arrayValue, entityType)] === this.getPermissionName(arrayValue);

      if (!isValidEntity || !isValidPermission) {
        const permissionError = new PermissionError(project.key, repoName, entityType, this.getDisplayName(arrayValue, entityType), this.getPermissionName(arrayValue));

        errors.push(permissionError);
      }
    }

    return errors;
  }

  /**
   * Get name
   *
   * @param {Object} arrayItem A user or group
   * @param {String} entityType Type of entity (i.e. Users or Groups)
   * @returns {String} Name of the permission
   * @memberof Validator
   */
  getName(arrayItem, entityType) {
    if (entityType === 'Users') {
      return arrayItem.user.name;
    }

    return arrayItem.group.name;
  }

  /**
   * Get the display name of the entity
   *
   * @param {Object} arrayItem A user or group
   * @param {String} entityType Type of entity (i.e. Users or Groups)
   * @returns {String} The display name of the entity
   * @memberof Validator
   */
  getDisplayName(arrayItem, entityType) {
    if (entityType === 'Users') {
      return arrayItem.user.displayName;
    }

    return arrayItem.group.name;
  }

  /**
   * Get the Bitbucket permission name
   *
   * @param {Object} arrayItem A user or group
   * @returns {String} Name of the permission
   * @memberof Validator
   */
  getPermissionName(arrayItem) {
    return arrayItem.permission;
  }

}

module.exports = Validator;
