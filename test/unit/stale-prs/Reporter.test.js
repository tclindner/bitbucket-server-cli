'use strict';

const chai = require('chai');
const chalk = require('chalk');
const sinon = require('sinon');
const PullRequest = require('./../../../src/plugins/stale-prs/PullRequest');
const Reporter = require('./../../../src/plugins/stale-prs/Reporter');

const should = chai.should();

describe('Reporter Unit Tests', function() {
  describe('write method', function() {
    context('when an array is passed', function() {
      const dummyPullRequestObj = {
        id: 1,
        title: '',
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
          displayId: 1
        }
      };
      let spy;

      beforeEach(function() {
        spy = sinon.spy(console, 'log');
      });

      afterEach(function() {
        console.log.restore();
      });

      it('with an array with zero pull requests is passed a formatted message should be returned saying there are no pull requests', function() {
        const pullRequests = [];
        const output = chalk.green.bold('No stale pull requests found!');

        Reporter.write(pullRequests);
        spy.withArgs(output).calledOnce.should.be.true;
      });

      it('when an array with one pull request is passed a formatted message should be returned saying there is one pull request', function() {
        const pullRequests = [];
        const output = `${chalk.red.bold(1)} stale pull request found.`;

        pullRequests.push(new PullRequest('PROJECT', 'repo', dummyPullRequestObj));

        Reporter.write(pullRequests);
        spy.calledTwice.should.be.true;
        spy.secondCall.calledWithExactly(output).should.be.true;
      });

      it('when an array with twos pull requests are passed a formatted message should be returned saying there are two pull requests', function() {
        const pullRequests = [];
        const output = `${chalk.red.bold(2)} stale pull requests found.`;

        pullRequests.push(new PullRequest('PROJECT', 'repo', dummyPullRequestObj));
        pullRequests.push(new PullRequest('PROJECT', 'repo', dummyPullRequestObj));

        Reporter.write(pullRequests);
        spy.calledThrice.should.be.true;
        spy.thirdCall.calledWithExactly(output).should.be.true;
      });
    });
  });
});
