# bitbucket-server-cli - Pull Request Stats Plugin

## Security

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

## Configuration

Create a `pullRequestStatsConfig.json` file and place it in the `bitbucket-server-cli` configuration directory

List each project you would like to scan. The root of the file requires a `startDate` and `endDate` to provide bounds for what pull requests to run stats on.

```
{
  "startDate": "MM/DD/YYYY",
  "endDate": "MM/DD/YYYY",
  "projects": {
    "YOUR_KEY_CAN_BE_ANYTHING": {
      "key": "BITBUCKET_PROJECT_KEY",
      "excludedRepos": [
        "BITBUCKET_REPO_SLUG"
      ]
    }
  }
}

```

Example:

Bitbucket Project Key: FRONTENDREPOS

```
{
  "startDate": "03/01/2017",
  "endDate": "04/01/2018",
  "projects": {
    "frontend": {
      "key": "FRONTENDREPOS",
      "excludedRepos": [
        "front-end-automation"
      ]
    }
  }
}

```
