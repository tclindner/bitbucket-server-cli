'use strict';

const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();

const BitbucketApiClient = require('./../../../src/api/BitbucketApiClient');
const RequestHelper = require('./../../../src/api/RequestHelper');

/* eslint object-curly-newline: 'off' */

const options = {
  auth: {
    auth: {
      user: 'username',
      pass: 'password'
    }
  }
};

describe('BitbucketApiClient Unit Tests', function() {
  context('projects method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.projects().should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getProjectGroupPermissions method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/permissions/groups';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getProjectGroupPermissions('ABC').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getProjectUserPermissions method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/permissions/users';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getProjectUserPermissions('ABC').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getRepos method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getRepos('ABC').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getRepoGroupPermissions method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/permissions/groups';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getRepoGroupPermissions('ABC', 'DEF').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getRepoUserPermissions method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/permissions/users';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getRepoUserPermissions('ABC', 'DEF').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getPullRequests method', function() {
    it('without state', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/pull-requests';

      const options = {
        auth: {
          auth: {
            user: 'username',
            pass: 'password'
          }
        },
        queryParams: '&state=OPEN'
      };

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getPullRequests('ABC', 'DEF').should.be.true;

      RequestHelper.walker.restore();
    });

    it('with state', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/pull-requests';

      const options = {
        auth: {
          auth: {
            user: 'username',
            pass: 'password'
          }
        },
        queryParams: '&state=MERGED'
      };

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getPullRequests('ABC', 'DEF', 'MERGED').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getPullRequestCommits method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'walker');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/pull-requests/1/commits';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getPullRequestCommits('ABC', 'DEF', '1').should.be.true;

      RequestHelper.walker.restore();
    });
  });

  context('getPullRequestTaskCount method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'nonPagedRequest');
      const url = 'https://www.example.com/rest/api/1.0/projects/ABC/repos/DEF/pull-requests/1/tasks/count';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getPullRequestTaskCount('ABC', 'DEF', '1').should.be.true;

      RequestHelper.nonPagedRequest.restore();
    });
  });

  context('getPullRequestIssues method', function() {
    it('standard call', function() {
      const bitbucket = new BitbucketApiClient('https://www.example.com', 'username', 'password');
      const stub = sinon.stub(RequestHelper, 'nonPagedRequest');
      const url = 'https://www.example.com/rest/jira/1.0/projects/ABC/repos/DEF/pull-requests/1/issues';

      stub.onFirstCall().returns(true);
      stub.calledWithExactly(url, options);

      bitbucket.getPullRequestIssues('ABC').should.be.true;

      RequestHelper.nonPagedRequest.restore();
    });
  });
});
