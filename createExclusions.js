const settingsUri = '/api/settings/set?key=';
var exclusions = require('./exclusions.json');
var connection = require('./connectionOptions');

exclusions.forEach(exclusion => {
    connection.options.path = settingsUri + exclusion.key;

    exclusion.values.forEach( value => {
        connection.options.path += '&values=' + encodeURIComponent(value);
    });

    createExclusionPostRequest = connection.http.request(connection.options);
    createExclusionPostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    createExclusionPostRequest.end();
});
