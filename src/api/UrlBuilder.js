'use strict';

class UrlBuilder {

  /**
   * Creates an instance of UrlBuilder.
   *
   * @param {String} baseUrl Base url of the Bitbucket API resources
   * @memberof UrlBuilder
   */
  constructor(baseUrl) {
    this.coreBitbucketRestUrl = `${baseUrl}/rest/api/1.0`;
  }

  /**
   * Build Projects API URL
   *
   * @returns {String} API endpoint for projects
   * @memberof UrlBuilder
   */
  getProjectsUrl() {
    return `${this.coreBitbucketRestUrl}/projects`;
  }

  /**
   * Build Project API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @returns {String} API endpoint for a project
   * @memberof UrlBuilder
   */
  getProjectUrl(projectKey) {
    return `${this.getProjectsUrl()}/${projectKey}`;
  }

  /**
   * Build Repo API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @returns {String} API endpoint for a repo
   * @memberof UrlBuilder
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
   * @memberof UrlBuilder
   */
  getPullRequestUrl(projectKey, repoKey) {
    return `${this.getRepoUrl(projectKey, repoKey)}/pull-requests`;
  }

  /**
   * Build Pull Request Details API URL
   *
   * @param {String} projectKey Valid Bitbucket project key
   * @param {String} repoKey Valid Bitbucket repo key
   * @param {String} pullRequestId ID of a Pull Request
   * @param {String} detailedEndPoint Type of pull request information. Ex: 'commits' or 'tasks/count'
   * @returns {String} API endpoint for a pull request
   * @memberof UrlBuilder
   */
  getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, detailedEndPoint) {
    return `${this.getPullRequestUrl(projectKey, repoKey)}/${pullRequestId}/${detailedEndPoint}`;
  }

}

module.exports = UrlBuilder;
