const createGroupUri = '/api/user_groups/create';
const createPermissionsUri = '/api/permissions/add_group_to_template';
var groups = require('./groups.json');
var connection = require('./connectionOptions');

groups.forEach(group => {
    connection.options.path = createGroupUri + '?name=' + group.name + '&description=' + encodeURIComponent(group.description);
    
    let thisgroup = group;
    createGroupPostRequest = connection.http.request(connection.options,(res) => {
        
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        if (res.statusCode === 200){
                setPermissions (thisgroup);
        };
    });
    createGroupPostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    createGroupPostRequest.end();
});

function setPermissions (group){
    
    var permissionsOptions = Object.assign({}, connection.options);
    
    permissionUriTemplate = createPermissionsUri + '?templateId=' + group.templateId + '&groupName=' + group.name;;
   
    group.permissions.forEach(permission =>{
        permissionsOptions.path = permissionUriTemplate + '&permission=' + permission;
        permissionsRequest = connection.http.request(permissionsOptions);
        permissionsRequest.on("error", (err) => {
            console.log("Error: " + err.message);
        });
        permissionsRequest.end();
    });
};

