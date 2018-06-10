'use strict';

const chalk = require('chalk');
const sinon = require('sinon');
const PermissionError = require('./../../../src/plugins/permissions/PermissionError');
const Reporter = require('./../../../src/plugins/permissions/Reporter');

const should = chai.should();

describe('Reporter Unit Tests', function() {
  describe('write method', function() {
    context('when an array is passed', function() {
      let spy;

      beforeEach(function() {
        spy = sinon.spy(console, 'log');
      });

      afterEach(function() {
        console.log.restore();
      });

      it('with an array with zero errors is passed a formatted message should be returned saying there are no errors', function() {
        const reporter = new Reporter();
        const errors = [];
        const output = chalk.green.bold('No permission errors found!');

        reporter.write(errors);
        spy.withArgs(output).calledOnce.should.be.true;
      });

      it('when an array with one error is passed a formatted message should be returned saying there is one error', function() {
        const reporter = new Reporter();
        const errors = [];
        const output = chalk.red.bold(1) + ' permission error found.';

        errors.push(new PermissionError('PROJECT', 'repoKey', 'Users', 'Thomas', 'REPO_ADMIN'));

        reporter.write(errors);
        spy.calledTwice.should.be.true;
        spy.secondCall.calledWithExactly(output).should.be.true;
      });

      it('when an array with twos errors are passed a formatted message should be returned saying there are two errors', function() {
        const reporter = new Reporter();
        const errors = [];
        const output = chalk.red.bold(2) + ' permission errors found.';

        errors.push(new PermissionError('PROJECT', 'repoKey', 'Users', 'Thomas', 'REPO_ADMIN'));
        errors.push(new PermissionError('PROJECT', 'repoKey', 'Users', 'Thomas', 'REPO_ADMIN'));

        reporter.write(errors);
        spy.calledThrice.should.be.true;
        spy.thirdCall.calledWithExactly(output).should.be.true;
      });
    });
  });
});
