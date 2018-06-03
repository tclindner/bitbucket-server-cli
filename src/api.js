'use strict';

const BitbucketApiClient = require('./api/BitbucketApiClient');

module.exports = {
  permissionsPlugin: function(bitbucketApiOptions, pluginOptions) {
    const bitbucketApiClient = new BitbucketApiClient(bitbucketApiOptions.baseUrl, bitbucketApiOptions.username, bitbucketApiOptions.password);

    const PermissionsPlugin = require('./plugins/permissions/PermissionsPlugin');
    const permissionsPlugin = new PermissionsPlugin(bitbucketApiClient, pluginOptions);

    return permissionsPlugin.execute();
  },
  stalePrPlugin: function(bitbucketApiOptions, pluginOptions) {
    const bitbucketApiClient = new BitbucketApiClient(bitbucketApiOptions.baseUrl, bitbucketApiOptions.username, bitbucketApiOptions.password);

    const StalePrs = require('./plugins/stale-prs/StalePrPlugin');
    const stalePrsPlugin = new StalePrs(bitbucketApiClient, pluginOptions);

    return stalePrsPlugin.execute();
  },
  statsPlugin: function(bitbucketApiOptions, pluginOptions) {
    const bitbucketApiClient = new BitbucketApiClient(bitbucketApiOptions.baseUrl, bitbucketApiOptions.username, bitbucketApiOptions.password);

    const PullRequestStatsPlugin = require('./plugins/stats/PullRequestStatsPlugin');
    const pullRequestStatsPlugin = new PullRequestStatsPlugin(bitbucketApiClient, pluginOptions);

    return pullRequestStatsPlugin.execute();
  }
};
