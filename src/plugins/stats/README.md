# bitbucket-server-cli - Pull Request Stats Plugin

## Security

> NOTE: You will need ADMIN permissions to each project/repo you are auditing.

## Commands and configuration

> NOTE: Please ensure that you've configured the required environment variables.

### Global Options

| Option | Alias | Description |
|---|---|---|
| --startDate | -s | Start date to check for stats |
| --endDate | -s | End date to check for stats |
| --range | -s | Relative time range to check for stats. Range is relative to today. |

You must provide `startDate` and `endDate` OR `range`. If all three are set the fixed date range will be used over the range.

### Command

Full command, `pr-stats`
Alias, `s`

## Examples

`bitbucket-server-cli -p "MYPROJECTKEY,MYPROJECTKEY2" -s "05/01/2018" -e "05/31/2018" pr-stats`

> Aggregate stats for `MYPROJECTKEY` and `MYPROJECTKEY2` between `05/01/2018` and `05/31/2018`.

`bitbucket-server-cli -p "MYPROJECTKEY" -r "30 days" pr-stats`

> Aggregate stats for `MYPROJECTKEY` for the last `30 days`.

`bitbucket-server-cli -p "MYPROJECTKEY" -s "1 hour" s`

> Aggregate stats for `MYPROJECTKEY` for the last `1 hour`.

### Examples for definition of stale

1. 1 hour
2. 4 hours
3. 1 day
3. 4 days
