'use strict';

const request = require('request');

class BitbucketAPI {

  /**
   * Creates an instance of BitbucketAPI.
   * @param {String} baseUrl Base URL of the Bitbucket server
   * @param {String} username Username used to authenticate with Bitbucket
   * @param {String} password Password used to authenticate with Bitbucket
   * @memberof BitbucketAPI
   */
  constructor(baseUrl, username, password) {
    this.coreBitbucketRestUrl = `${baseUrl}/rest/api/1.0`;
    this.jiraBitbucketIntegrationRestUrl = `${baseUrl}/rest/jira/1.0`;
    this.auth = {
      auth: {
        user: username,
        pass: password
      }
    };
  }

  /**
   * Helper method used to initialize a value with a default value fallback
   *
   * @param {Number} value Number to set the value to if it exists
   * @param {Number} defaultValue Value that will default in if the passed value doesn't exist
   * @returns {Number} Value or default
   * @memberof BitbucketAPI
   */
  _initializeValue(value, defaultValue) {
    if (!value) {
      value = defaultValue;
    }

    return value;
  }

  /**
   * Recursive API walker that tranverses Bitbucket's paged API
   *
   * @param {String} url API endpoint to call
   * @param {String} queryParams Query string parameters to add to the request
   * @param {Number} start Page to start on
   * @param {Number} limit Number of items to limit in the request
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof BitbucketAPI
   */
  walker(url, queryParams, start, limit) {
    start = this._initializeValue(start, 0);
    limit = this._initializeValue(limit, 25);
    queryParams = this._initializeValue(queryParams, '');

    return new Promise((resolve, reject) => {
      request.get(
        `${url}?start=${start}&limit=${limit}${queryParams}`,
        this.auth,
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let data = JSON.parse(body);
            let values = data.values;
            if (!data.isLastPage) {
              this.walker(url, queryParams, data.nextPageStart, data.limit).then((additionalValues) => {
                values = values.concat(additionalValues);
                resolve(values);
              }).catch(function(error) {
                reject(error);
              });
            } else {
              resolve(values);
            }
          } else {
            console.log(error);
            console.log(response.statusCode);
            console.log(body);
            reject(body);
          }
        }
      );
    });
  }

  /**
   * Non-paged API call
   *
   * @param {String} url API endpoint to call
   * @returns {Promise} A promise that will resolve to the value of the API call
   * @memberof BitbucketAPI
   */
  nonPagedRequest(url) {
    return new Promise((resolve, reject) => {
      request.get(
        url,
        this.auth,
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            let values = JSON.parse(body);
            resolve(values);
          } else {
            console.log(error);
            console.log(response.statusCode);
            console.log(body);
            reject(body);
          }
        }
      );
    });
  }

  /**
   * Build Project API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {String} API endpoint for a project
   * @memberof BitbucketAPI
   */
  getProjectUrl(projectKey) {
    return `${this.coreBitbucketRestUrl}/projects/${projectKey}`;
  }

  /**
   * Build Repo API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {String} API endpoint for a repo
   * @memberof BitbucketAPI
   */
  getRepoUrl(projectKey, repoKey) {
    return `${this.getProjectUrl(projectKey)}/repos/${repoKey}`;
  }

  /**
   * Build Pull Request API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {String} API endpoint for a pull request
   * @memberof BitbucketAPI
   */
  getPullRequestUrl(projectKey, repoKey) {
    return `${this.getRepoUrl(projectKey, repoKey)}/pull-requests`;
  }

  /**
   * Bull Pull Request Details API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId ID of a Pull Request
   * @param {String} detailedEndPoint ?
   * @returns {String} API endpoint for a pull request
   * @memberof BitbucketAPI
   */
  getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, detailedEndPoint) {
    return `${this.getPullRequestUrl(projectKey, repoKey)}/${pullRequestId}/${detailedEndPoint}`;
  }

  /**
   * Retrieve a project
   *
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrieveProjects() {
    return this.walker(`${this.coreBitbucketRestUrl}/projects`);
  }

  /**
   * Retrieves the group permissions for a project
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrieveProjectGroupPermissions(projectKey) {
    return this.walker(`${this.getProjectUrl(projectKey)}/permissions/groups`);
  }

  /**
   * Retrieves the user permissions for a project
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrieveProjectUserPermissions(projectKey) {
    return this.walker(`${this.getProjectUrl(projectKey)}/permissions/users`);
  }

  /**
   * Retrieve repos for a project
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrieveRepositories(projectKey) {
    return this.walker(`${this.getProjectUrl(projectKey)}/repos`);
  }

  /**
   * Retrieves the group permissions for a repo
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrieveRepoGroupPermissions(projectKey, repoKey) {
    return this.walker(`${this.getRepoUrl(projectKey, repoKey)}/permissions/groups`);
  }

  /**
   * Retrieves the user permissions for a repo
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrieveRepoUserPermissions(projectKey, repoKey) {
    return this.walker(`${this.getRepoUrl(projectKey, repoKey)}/permissions/users`);
  }

  /**
   * Fetch pull requests
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} state Desired state that the PR is in. Ex: MERGED, OPEN, etc.
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrievePullRequests(projectKey, repoKey, state) {
    if (typeof state === 'undefined') {
      state = 'OPEN';
    }

    const url = this.getPullRequestUrl(projectKey, repoKey);
    const urlParams = `&state=${state}`;

    return this.walker(url, urlParams);
  }

  /**
   * Fetch the commits for a pull request
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId Valid pull request ID
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrievePullRequestCommits(projectKey, repoKey, pullRequestId) {
    const url = this.getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, 'commits');

    return this.walker(url);
  }

  /**
   * Fetch the task count for a pull request
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId Valid pull request ID
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrievePullRequestTaskCount(projectKey, repoKey, pullRequestId) {
    const url = this.getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, 'tasks/count');

    return this.nonPagedRequest(url);
  }

  /**
   * Fetch Issues associated with a Pull Request
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId Valid pull request ID
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketAPI
   */
  retrievePullRequestIssues(projectKey, repoKey, pullRequestId) {
    const url = `${this.jiraBitbucketIntegrationRestUrl}/projects/${projectKey}/repos/${repoKey}/pull-requests/${pullRequestId}/issues`;

    return this.nonPagedRequest(url);
  }
}

module.exports = BitbucketAPI;
