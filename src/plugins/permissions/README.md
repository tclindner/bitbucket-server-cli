# bitbucket-server-cli - Permissions Plugin

## Security

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

## Configuration

Create a `permissionsConfig.json` file and place it in the `bitbucket-server-cli` configuration directory

List the valid group and user permissions for each project you want to audit.

```
{
  "YOUR_KEY_CAN_BE_ANYTHING": {
    "key": "BITBUCKET_PROJECT_KEY",
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
    },
    "branchPermissions": {
      "groups": {},
      "users": {}
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

```
{
  "frontend": {
    "key": "FRONTEND",
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
    },
    "branchPermissions": {
      "groups": {},
      "users": {}
    }
  }
}

```
