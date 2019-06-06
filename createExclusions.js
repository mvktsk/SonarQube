const http = require('http');
const uri = 'localhost';
const settingsUri = '/api/settings/set?key=';
var exclusions = require('./exclusions.json');

var options = {
    auth: 'admin:admin',
    hostname: uri,
    port: 9000,
    path: '/',
    method: 'POST'
};

exclusions.forEach(exclusion => {
    options.path = settingsUri + exclusion.key;

    exclusion.values.forEach( value => {
        options.path += '&values=' + encodeURIComponent(value);
    });

    createExclusionPostRequest = http.request(options);
    createExclusionPostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    createExclusionPostRequest.end();


});
