'use strict';

/* eslint id-length: 'off', class-methods-use-this: 'off', no-magic-numbers: 'off', no-param-reassign: 'off', no-negated-condition: 'off' */
const RequestHelper = require('./RequestHelper');
const UrlBuilder = require('./UrlBuilder');

class BitbucketApiClient {

  /**
   * Creates an instance of BitbucketApiClient.
   *
   * @param {String} baseUrl Base URL of the Bitbucket server
   * @param {String} username Username used to authenticate with Bitbucket
   * @param {String} password Password used to authenticate with Bitbucket
   * @memberof BitbucketApiClient
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

    this.urlBuilder = new UrlBuilder(baseUrl);
  }

  /**
   * Retrieves a list of projects
   * Only projects for which the authenticated user has the PROJECT_VIEW permission will be returned.
   *
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  projects() {
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(this.urlBuilder.getProjectsUrl(), options);
  }

  /**
   * Retrieves the group permissions for a project
   * The authenticated user must have PROJECT_ADMIN permission for the specified project
   * or a higher global permission to call this API.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getProjectGroupPermissions(projectKey) {
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(`${this.urlBuilder.getProjectUrl(projectKey)}/permissions/groups`, options);
  }

  /**
   * Retrieves the user permissions for a project
   * The authenticated user must have PROJECT_ADMIN permission for the specified project
   * or a higher global permission to call this resource.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getProjectUserPermissions(projectKey) {
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(`${this.urlBuilder.getProjectUrl(projectKey)}/permissions/users`, options);
  }

  /**
   * Retrieve repos for a project
   * The authenticated user must have REPO_READ permission for the
   * specified project to call this resource.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getRepos(projectKey) {
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(`${this.urlBuilder.getProjectUrl(projectKey)}/repos`, options);
  }

  /**
   * Retrieves the group permissions for a repo
   * The authenticated user must have REPO_ADMIN permission for the specified
   * repository or a higher project or global permission to call this resource.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getRepoGroupPermissions(projectKey, repoKey) {
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(`${this.urlBuilder.getRepoUrl(projectKey, repoKey)}/permissions/groups`, options);
  }

  /**
   * Retrieves the user permissions for a repo
   * The authenticated user must have REPO_ADMIN permission for the specified
   * repository or a higher project or global permission to call this resource.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getRepoUserPermissions(projectKey, repoKey) {
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(`${this.urlBuilder.getRepoUrl(projectKey, repoKey)}/permissions/users`, options);
  }

  /**
   * Fetch pull requests
   * The authenticated user must have REPO_READ permission for the specified
   * repository to call this resource.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} state Desired state that the PR is in. Valid values include: OPEN, DECLINED or MERGED
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getPullRequests(projectKey, repoKey, state) {
    if (typeof state === 'undefined') {
      state = 'OPEN';
    }

    const url = this.urlBuilder.getPullRequestUrl(projectKey, repoKey);
    const urlParams = `&state=${state}`;
    const options = {
      auth: this.auth,
      urlParams
    };

    return RequestHelper.walker(url, options);
  }

  /**
   * Fetch the commits for a pull request
   * The authenticated user must have REPO_READ permission for the repository
   * that this pull request targets to call this resource.
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId Valid pull request ID
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getPullRequestCommits(projectKey, repoKey, pullRequestId) {
    const url = this.urlBuilder.getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, 'commits');
    const options = {
      auth: this.auth
    };

    return RequestHelper.walker(url, options);
  }

  /**
   * Fetch the task count for a pull request
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId Valid pull request ID
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getPullRequestTaskCount(projectKey, repoKey, pullRequestId) {
    const url = this.urlBuilder.getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, 'tasks/count');
    const options = {
      auth: this.auth
    };

    return RequestHelper.nonPagedRequest(url, options);
  }

  /**
   * Fetch Issues associated with a Pull Request
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId Valid pull request ID
   * @returns {Promise} A promise to return API results
   * @memberof BitbucketApiClient
   */
  getPullRequestIssues(projectKey, repoKey, pullRequestId) {
    const url = `${this.jiraBitbucketIntegrationRestUrl}/projects/${projectKey}/repos/${repoKey}/pull-requests/${pullRequestId}/issues`;
    const options = {
      auth: this.auth
    };

    return RequestHelper.nonPagedRequest(url, options);
  }

}

module.exports = BitbucketApiClient;
