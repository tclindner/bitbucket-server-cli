'use strict';

const chai = require('chai');
const PullRequest = require('./../../../src/plugins/stale-prs/PullRequest');

const should = chai.should();

describe('PullRequest Unit Tests', function() {
  describe('constructor', function() {
    context('when all arguments are passed', function() {
      let pullRequest;
      const dummyPullRequestObj = {
        id: 1,
        title: 'title',
        author: {
          user: {
            displayName: 'Some, Dude'
          }
        },
        createdDate: 1457139523140,
        updatedDate: 1457139523140,
        fromRef: {
          displayId: 1
        },
        toRef: {
          displayId: 2
        }
      };

      before(function() {
        pullRequest = new PullRequest('PROJECT', 'repo', dummyPullRequestObj);
      });

      it('_project should be equal to PROJECT', function() {
        pullRequest._project.should.equal('PROJECT');
      });

      it('_repo should be equal to repo', function() {
        pullRequest._repo.should.equal('repo');
      });

      it('_id should be 1', function() {
        pullRequest._id.should.equal(1);
      });

      it('_title should be equal to title', function() {
        pullRequest._title.should.equal('title');
      });

      it('_author should be equal to Some, Dude', function() {
        pullRequest._author.should.equal('Some, Dude');
      });

      it('_createdDate should be equal to 1457139523140', function() {
        pullRequest._createdDate.should.equal('2016-03-04');
      });

      it('_fromBranchName should be equal to 1', function() {
        pullRequest._fromBranchName.should.equal(1);
      });

      it('_toBranchName should be equal to 2', function() {
        pullRequest._toBranchName.should.equal(2);
      });
    });
  });
});
