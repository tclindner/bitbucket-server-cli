#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const cliApp = require('commander');
const pkg = require('./../package.json');
const BitbucketApi = require('./BitbucketApi');

/**
 * Error handler
 * @param  {String}     err   Error message
 * @return {undefined}        No return
 */
const handleError = function(err) {
  const exitCode = 1;

  console.log(chalk.red.bold(err));
  process.exitCode = exitCode;
  throw new Error(err);
};

/**
 * Validates required parameters
 * @param {Object} params Object of parameters
 */
const validRequiredParams = function(baseUrl, username, password) {
  // Base URL
  if (typeof baseUrl !== 'string' || baseUrl === '') {
    handleError('Bitbucket Server Base URL ("-b") is required.');
  }

  // Username
  if (typeof username !== 'string' || username === '') {
    handleError('Bitbucket Server Username ("-u") is required.');
  }

  // Password
  if (typeof password !== 'string' || password === '') {
    handleError('Bitbucket Server Password ("-p") is required.');
  }
};

const completeMessage = chalk.green.bold('bitbucket-server-cli completed successfully');

// configure cli options
cliApp.version(pkg.version);
cliApp.usage(pkg.name);
cliApp.option('-b, --baseUrl <baseUrl>', 'Bitbucket Server Base URL');
cliApp.option('-u, --username <username>', 'Bitbucket Server Username');
cliApp.option('-p, --password <password>', 'Bitbucket Server Password');

cliApp
  .command('audit-permissions')
  .alias('ap')
  .description('Audit permissions')
  .option('-c, --config <configFile>', 'Path to config file')
  .action(function(configFile) {
    validRequiredParams(cliApp.baseUrl, cliApp.username, cliApp.password);
    const bitbucketApi = new BitbucketApi(cliApp.baseUrl, cliApp.username, cliApp.password);

    const PermissionsPlugin = require('./plugins/permissions/PermissionsPlugin');
    const permissionsPlugin = new PermissionsPlugin(bitbucketApi);
    permissionsPlugin.execute().then(function(results) {
      console.log(completeMessage);
    }).catch(function(error) {
      handleError(error);
    });
  });

cliApp
  .command('stale-prs')
  .alias('sp')
  .description('Fetch a list of Stale PRs')
  .option('-c, --config <configFile>', 'Path to config file')
  .action(function(configFile) {
    validRequiredParams(cliApp.baseUrl, cliApp.username, cliApp.password);
    const bitbucketApi = new BitbucketApi(cliApp.baseUrl, cliApp.username, cliApp.password);

    const StalePrs = require('./plugins/stale-prs/StalePrsPlugin');
    const stalePrsPlugin = new StalePrs(bitbucketApi);
    stalePrsPlugin.execute().then(function(results) {
      console.log(completeMessage);
    }).catch(function(error) {
      handleError(error);
    });
  });

cliApp
  .command('pr-stats')
  .alias('s')
  .description('Fetch PRs stats')
  .option('-c, --config <configFile>', 'Path to config file')
  .action(function(configFile) {
    validRequiredParams(cliApp.baseUrl, cliApp.username, cliApp.password);
    const bitbucketApi = new BitbucketApi(cliApp.baseUrl, cliApp.username, cliApp.password);

    const PullRequestStatsPlugin = require('./plugins/stats/PullRequestStatsPlugin');
    const pullRequestStatsPlugin = new PullRequestStatsPlugin(bitbucketApi);
    pullRequestStatsPlugin.execute().then(function(results) {
      console.log(completeMessage);
    }).catch(function(error) {
      handleError(error);
    });
  });

cliApp.parse(process.argv);
