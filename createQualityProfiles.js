const http = require('http');
const uri = 'localhost';
const restoreUri = '/api/qualityprofiles/restore';
const setDefaultUri = '/api/qualityprofiles/set_default';

var options = {
    auth: 'admin:admin',
    hostname: uri,
    port: 9000,
    path: restoreUri,
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data; boundary=',
        'Content-Length': 0
    }
};
const profiles = [
    "./virtoCssProfile.xml",
    "./virtoTypeScriptProfile.xml"
];

var boundary = String(Math.random()).slice(2);
var boundaryMiddle = '--' + boundary + '\r\n';
var boundaryLast = '--' + boundary + '--\r\n'


profiles.forEach(profile => {
    
    var profileData = boundaryMiddle;
    profileData += 'Content-Disposition: form-data; name="backup"' + '\r\n\r\n';
    profileData += readTextFile(profile) + '\r\n';
    profileData += boundaryLast;
    
    options.headers["Content-Type"] = 'multipart/form-data; boundary=' + boundary;
    options.headers["Content-Length"] = Buffer.byteLength(profileData);
    
    createProfilePostRequest = http.request(options, (res) => {
        
        let data = '';

        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            
            data += chunk;
            
            console.log(`BODY: ${chunk}`);
        });
        
        res.on('end', () => {
            profileKey = JSON.parse(data).profile.key;
            setDefaultProfile (profileKey);
            
            console.log('No more data in response.');
        });

    });
    
    createProfilePostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    
    // Write data to request body
    
    createProfilePostRequest.write(profileData);
    createProfilePostRequest.end();
    

});

function readTextFile(file){
    
    var fs = require("fs");
    var text = fs.readFileSync(file).toString('utf-8');
    return text;
}

function setDefaultProfile (profileKey){
    
    var setDefaultOptions = Object.assign({}, options);
    delete setDefaultOptions.headers;

    profileKey = 'profileKey=' + profileKey;
    
    setDefaultOptions.path = setDefaultUri + '?' + profileKey;

    setDefaultPostRequest = http.request(setDefaultOptions);
    setDefaultPostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    setDefaultPostRequest.end();

}
