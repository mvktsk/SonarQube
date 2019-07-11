const http = require('http');
const url = 'localhost';
var options = {
    auth: 'admin:admin',
    hostname: url,
    port: 9000,
    path: '/',
    method: 'POST'
};
module.exports.http = http;
module.exports.options = options;