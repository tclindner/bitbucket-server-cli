'use strict';

const chalk = require('chalk');
const chai = require('chai');
const PermissionError = require('./../../../src/plugins/permissions/PermissionError');

const should = chai.should();

/* eslint prefer-template: 'off' */

describe('PermissionError Unit Tests', function() {
  describe('constructor', function() {
    context('when all arguments are passed', function() {
      let permissionError;

      before(function() {
        permissionError = new PermissionError('PROJECT', 'repo', 'Users', 'Thomas', 'REPO_ADMIN');
      });

      it('_project should be equal to PROJECT', function() {
        permissionError._project.should.equal('PROJECT');
      });

      it('_repo should be equal to repo', function() {
        permissionError._repo.should.equal('repo');
      });

      it('_isRepo should be true', function() {
        permissionError._isRepo.should.be.true;
      });

      it('_entity should be equal to Users', function() {
        permissionError._entity.should.equal('Users');
      });

      it('_entityName should be equal to Thomas', function() {
        permissionError._entityName.should.equal('Thomas');
      });

      it('_permission should be equal to REPO_ADMIN', function() {
        permissionError._permission.should.equal('REPO_ADMIN');
      });
    });

    context('when repo is null', function() {
      it('_isRepo should be false', function() {
        const permissionError = new PermissionError('PROJECT', null, 'Users', 'Thomas', 'REPO_ADMIN');

        permissionError._isRepo.should.be.false;
      });
    });

    context('when repo is an empty string', function() {
      it('_isRepo should be false', function() {
        const permissionError = new PermissionError('PROJECT', '', 'Users', 'Thomas', 'REPO_ADMIN');

        permissionError._isRepo.should.be.false;
      });
    });
  });

  describe('getMessage()', function() {
    context('when getMessage() is called and isRepo is true', function() {
      it('a formatted error message should be returned', function() {
        let errorMessage = chalk.bgWhite.black('Repo permission error detected \n');

        errorMessage += `${chalk.white.bold('Project:')} ${chalk.white('PROJECT')} \n`;
        errorMessage += `${chalk.white.bold('Repo:')} ${chalk.white('repo')} \n`;
        errorMessage += `${chalk.cyan.bold('Users:')} ${chalk.cyan('Thomas')} \n`;
        errorMessage += `${chalk.cyan.bold('Permission:')} ${chalk.cyan('REPO_ADMIN')} \n`;

        const permissionError = new PermissionError('PROJECT', 'repo', 'Users', 'Thomas', 'REPO_ADMIN');

        permissionError.getMessage().should.equal(errorMessage);
      });
    });

    context('when getMessage() is called and isRepo is false', function() {
      it('a formatted error message should be returned', function() {
        let errorMessage = chalk.bgWhite.black('Project permission error detected \n');

        errorMessage += `${chalk.white.bold('Project:')} ${chalk.white('PROJECT')} \n`;
        errorMessage += `${chalk.cyan.bold('Users:')} ${chalk.cyan('Thomas')} \n`;
        errorMessage += `${chalk.cyan.bold('Permission:')} ${chalk.cyan('PROJECT_ADMIN')} \n`;

        const permissionError = new PermissionError('PROJECT', '', 'Users', 'Thomas', 'PROJECT_ADMIN');

        permissionError.getMessage().should.equal(errorMessage);
      });
    });
  });
});
