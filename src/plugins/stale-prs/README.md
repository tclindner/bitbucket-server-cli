# bitbucket-server-cli - Stale PRs Plugin

## Security

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

## Commands and configuration

> NOTE: Please ensure that you've configured the required environment variables.

### Global Options

| Option | Alias | Description |
|---|---|---|
| --definitionOfStale | -s | Definition of stale |

### Command

Full command, `stale-prs`
Alias, `sp`

## Examples

`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -s "30 days" stale-prs`

> Check `MYPROJECTKEY` and `MYPROJECTKEY2` for open pull requests that were opened more than `30 days` ago.

`bitbucket-server-cli -p "MYPROJECTKEY" -s "1 hour" sp`

> Check `MYPROJECTKEY` for open pull requests that were opened more than `1 hour` ago.

### Examples for definition of stale

1. 1 hour
2. 4 hours
3. 1 day
3. 4 days
