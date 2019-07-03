const https = require('https');
const uri = 'sonar.virtocommerce.com';
const deleteProjectUri = '/api/projects/delete?project=';

var options = {
    auth: 'admin:admin',
    hostname: uri,
    port: 443,
    path: '/',
    method: 'POST'
};


var fs = require('fs');
var vcProjectsToDelete = fs.readFileSync('vcPrjectsToDelete.txt').toString().split("\n");
vcProjectsToDelete.forEach(project => {
    options.path = deleteProjectUri + encodeURIComponent(project);
//    console.log(options.path);

    deletePostRequest = https.request( options);
    deletePostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    deletePostRequest.end();
 });

