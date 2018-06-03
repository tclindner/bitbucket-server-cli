'use strict';

const chalk = require('chalk');
const PermissionError = require('./PermissionError');

/* eslint id-length: 'off', max-params: 'off', class-methods-use-this: 'off' */

class Validator {

  /**
   * Creates an instance of Validator.
   *
   * @param {Object} bitbucketApiClient BitbucketApiClient object
   * @param {object} options StalePrsPlugin options
   * @memberof Validator
   */
  constructor(bitbucketApiClient, options) {
    this.bitbucketApiClient = bitbucketApiClient;
    this.options = options;
  }

  /**
   * Validate a project
   *
   * @param {string} project Bitbucket project key.
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
        console.log(chalk.green(`${chalk.bold(project)}  project audit complete`));

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
   * @param {string} project Bitbucket project key.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateProjectGroupPermissions(project) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getProjectGroupPermissions(project).then((groups) => {
        resolve(this.auditPermissions(project, '', groups, 'Group', this.options.projectPermissions.groups));
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Validate a project's user permissions
   *
   * @param {string} project Bitbucket project key.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateProjectUserPermissions(project) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getProjectUserPermissions(project).then((users) => {
        resolve(this.auditPermissions(project, '', users, 'Users', this.options.projectPermissions.users));
      }).catch((error) => {
        reject(new Error(error));
      });
    });
  }

  /**
   * Process project repos
   *
   * @param {string} project Bitbucket project key.
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  processProjectRepos(project) {
    // Fetch Repo Info Below
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepos(project).then((repos) => {
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
   * @param {string} project Bitbucket project key.
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
   * @param {string} project Bitbucket project key.
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
   * @param {string} project Bitbucket project key.
   * @param {Array} repo Bitbucket repo object
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateRepoGroupPermissions(project, repo) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepoGroupPermissions(repo.project.key, repo.slug).then((groups) => {
        resolve(this.auditPermissions(project, repo, groups, 'Group', this.options.repoPermissions.groups));
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Validate a repo's user permissions
   *
   * @param {string} project Bitbucket project key.
   * @param {Array} repo Bitbucket repo object
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof Validator
   */
  validateRepoUserPermissions(project, repo) {
    return new Promise((resolve, reject) => {
      this.bitbucketApiClient.getRepoUserPermissions(repo.project.key, repo.slug).then((users) => {
        resolve(this.auditPermissions(project, repo, users, 'Users', this.options.repoPermissions.users));
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  /**
   * Audit permissions
   *
   * @param {string} project Bitbucket project key.
   * @param {Object} repo Bitbucket repo object
   * @param {Array} array An array of users or groups
   * @param {String} entityType Entity type of the array
   * @param {Object} validPermissions An object of valid permissions
   * @returns {Array} An array of PermissionError objects
   * @memberof Validator
   */
  auditPermissions(project, repo, array, entityType, validPermissions) {
    /* eslint max-statements: 'off' */
    const repoName = repo.hasOwnProperty('slug') ? repo.slug : '';
    const errors = [];

    for (const arrayValue of array) {
      const isValidEntity = validPermissions.hasOwnProperty(this.getName(arrayValue, entityType));
      const isValidPermission = validPermissions[this.getName(arrayValue, entityType)] === this.getPermissionName(arrayValue);

      if (!isValidEntity || !isValidPermission) {
        const permissionError = new PermissionError(project, repoName, entityType, this.getDisplayName(arrayValue, entityType), this.getPermissionName(arrayValue));

        errors.push(permissionError);
      }
    }

    const entityNames = array.map((entity) => this.getName(entity, entityType));

    for (const entityName in validPermissions) {
      const hasEntity = entityNames.includes(entityName);

      if (!hasEntity) {
        const permissionError = new PermissionError(project, repoName, entityType, entityName, validPermissions[entityName]);

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
