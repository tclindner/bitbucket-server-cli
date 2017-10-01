'use strict';

let request = require('request');

class Bitbucket {
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

  _initializeValue(value, defaultValue) {
    if (!value) {
      value = defaultValue;
    }

    return value;
  }

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

  getProjectUrl(projectKey) {
    return this.coreBitbucketRestUrl + '/projects/' + projectKey;
  }

  getRepoUrl(projectKey, repoKey) {
    return this.getProjectUrl(projectKey) + '/repos/' + repoKey;
  }

  getPullRequestUrl(projectKey, repoKey) {
    return this.getRepoUrl(projectKey, repoKey) + '/pull-requests';
  }

  getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, detailedEndPoint) {
    return this.getPullRequestUrl(projectKey, repoKey) + '/' + pullRequestId + '/' + detailedEndPoint;
  }

  retrieveProjects(start, limit) {
    return this.walker(`${this.coreBitbucketRestUrl}/projects`);
  }

  retrieveProjectGroupPermissions(projectKey) {
    return this.walker(this.getProjectUrl(projectKey) + '/permissions/groups');
  }

  retrieveProjectUserPermissions(projectKey) {
    return this.walker(this.getProjectUrl(projectKey) + '/permissions/users');
  }

  retrieveRepositories(projectKey, start, limit) {
    return this.walker(this.getProjectUrl(projectKey) + '/repos');
  }

  retrieveRepoGroupPermissions(projectKey, repoKey) {
    return this.walker(this.getRepoUrl(projectKey, repoKey) + '/permissions/groups');
  }

  retrieveRepoUserPermissions(projectKey, repoKey) {
    return this.walker(this.getRepoUrl(projectKey, repoKey) + '/permissions/users');
  }

  retrievePullRequests(projectKey, repoKey, state) {
    if (typeof state === 'undefined') {
      state = 'OPEN';
    }

    const url = this.getPullRequestUrl(projectKey, repoKey);
    const urlParams = `&state=${state}`;

    return this.walker(url, urlParams);
  }

  retrievePullRequestCommits(projectKey, repoKey, pullRequestId) {
    const url = this.getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, 'commits');

    return this.walker(url);
  }

  retrievePullRequestTaskCount(projectKey, repoKey, pullRequestId) {
    const url = this.getPullRequestDetailsUrl(projectKey, repoKey, pullRequestId, 'tasks/count');

    return this.nonPagedRequest(url);
  }

  retrievePullRequestIssues(projectKey, repoKey, pullRequestId) {
    const url = `${this.jiraBitbucketIntegrationRestUrl}/projects/${projectKey}/repos/${repoKey}/pull-requests/${pullRequestId}/issues`;

    return this.nonPagedRequest(url);
  }
}

module.exports = Bitbucket;
