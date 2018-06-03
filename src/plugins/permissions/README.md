# bitbucket-server-cli - Permissions Plugin

## Security

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

## Commands and configuration

> NOTE: Please ensure that you've configured the required environment variables.

### Configuration

Create a `permissionsConfig.json` file.

List the valid group and user permissions for each project you want to audit.

```json
{
  "projectPermissions": {
    "groups": {
      "AD_GROUP_KEY": "BITBUCKET_PERMISSION_NAME"
    },
    "users": {
      "USER_ID": "BITBUCKET_PERMISSION_NAME"
    }
  },
  "repoPermissions": {
    "groups": {
      "AD_GROUP_KEY": "BITBUCKET_PERMISSION_NAME"
    },
    "users": {
      "USER_ID": "BITBUCKET_PERMISSION_NAME"
    }
  }
}

```

Valid list of Bitbucket Project Permissions

1. PROJECT_ADMIN
2. PROJECT_WRITE
3. PROJECT_READ

Valid list of Bitbucket Repo Permissions

 1. REPO_ADMIN
 2. REPO_WRITE
 3. REPO_READ

Example:

```json
{
  "projectPermissions": {
    "groups": {
      "all-front-end-devs": "PROJECT_ADMIN"
    },
    "users": {
      "frontEndDev": "PROJECT_ADMIN"
    }
  },
  "repoPermissions": {
    "groups": {
      "all-front-end-devs": "REPO_ADMIN"
    },
    "users": {
      "frontEndDev": "REPO_ADMIN"
    }
  }
}

```

### Global Options

| Option | Alias | Description |
|---|---|---|
| --configFile | -c | Path to config file relative to the current working directory. |

### Command

Full command, `audit-permissions`
Alias, `ap`

## Examples

`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -c "./permissionsConfig.json" audit-permissions`

> Checks `MYPROJECTKEY` and `MYPROJECTKEY2` for permissions issues based on the settings in `./permissionsConfig.json`.

`bitbucket-server-cli -p "MYPROJECTKEY" -c "./permissionsConfig.json" audit-permissions`

> Checks `MYPROJECTKEY` for permissions issues based on the settings in `./permissionsConfig.json`.

`bitbucket-server-cli -p "MYPROJECTKEY" -c "./permissionsConfig.json" ap`

> Checks `MYPROJECTKEY` for permissions issues based on the settings in `./permissionsConfig.json`.
