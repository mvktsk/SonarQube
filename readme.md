# VirtoCommerce SonarQube configuration

This repository contain base configuration files and js scripts for automatic configuration implementation on VirtoCommerce SonarQube servers.
Scripts and configuration files can be applied on a new SonarQube installation to configure the server in accordance with the VirtoCommerce quality requirements.

## Configuration files

1. **gates.json** - SonarQube quality gates configuration file
1. **exclusions.json** - projects file paths or files are excluded from the analysis
1. **virtoCssProfile.xml** - custom CSS profile backup
1. **virtoTypeScriptProfile.xml** - custom TypeScript profile backup
1. **groups.json** - custom user groups and permissions

## New SonarQube server configuration

To apply the settings on the new SonarQube installation standard SonarQube API used.
For configuration applying, js scripts are created that read configuration files and call the corresponding SonarQube API to apply the settings.

Each js script contain *options* object and *uri* const. Options describe SonarQube connection parameters, uri - connection string name to the server.

```js
const uri = 'localhost';
var options = {
    auth: 'admin:admin',
    hostname: uri,
    port: 9000,
    path: '/',
    method: 'POST'
};
```

Before scripts execution, fill in with your parameters

* uri - your server url or IP
* options.auth - login:password your SonarQube admin user
* options.port your SonarQube port

To use the configuration correctly, run the js scripts in the following sequence:

1. **createExclusions.js** - exclude file paths or file from quality analysis (to run, type in terminal *node createExclusions.js*)
1. **createGates.js** - create Red, Orange, Green, Blue quality gates, set Green as default (to run, type in terminal *node createGates.js*)
1. **createQualityProfiles.js** - create Virto way TypeScript profile and Virto way CSS profile, set them as default (to run, type in terminal *node createQualityProfiles.js*)
1. **createGroups.js** - create custom TeamLead group and permission (to run, type in terminal *node createGroups.js*)

## Service files

2 service files created

1. **index.js** - gets quality gates conditions from reference SonarQube server
1. **requests.http** -used for SonarQube API tests with [VS Code Rest client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
