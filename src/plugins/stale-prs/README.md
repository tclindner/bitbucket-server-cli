# bitbucket-server-cli - Stale PRs Plugin

## Security

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

## Configuration

Create a `stalePrConfig.json` file and place it in the `bitbucket-server-cli` configuration directory

List each project you would like to scan. Multiple definitions of stale are supported. The root `definitionOfStale` is global and will apply to all projects unless they contain a project level override. It is also possible to exclude an array of repos for a given project from the scan.

```
{
  "definitionOfStale": "RELATIVE_TIME_DEFINITION_OF_STALE",
  "projects": {
    "YOUR_KEY_CAN_BE_ANYTHING": {
      "key": "BITBUCKET_PROJECT_KEY",
      "excludedRepos": [
        "BITBUCKET_REPO_SLUG"
      ],
      "definitionOfStale": "RELATIVE_TIME_DEFINITION_OF_STALE"
    },
    "YOUR_KEY_CAN_BE_ANYTHING": {
      "key": "BITBUCKET_PROJECT_KEY",
      "excludedRepos": [
        "BITBUCKET_REPO_SLUG"
      ],
      "definitionOfStale": "RELATIVE_TIME_DEFINITION_OF_STALE"
    }
  }
}

```

Examples for definition of stale

1. 1 hour
2. 4 hours
3. 1 day
3. 4 days

Example:

Bitbucket Project Key: FRONTENDREPOS

```
{
  "definitionOfStale": "1 day",
  "projects": {
    "frontend": {
      "key": "FRONTENDREPOS",
      "excludedRepos": [
        "front-end-automation"
      ],
      "definitionOfStale": "2 hours"
    },
    "backend": {
      "key": "BACKENDREPOS",
      "excludedRepos": [
        "back-end-automation"
      ],
      "definitionOfStale": "2 hours"
    }
  }
}
```
