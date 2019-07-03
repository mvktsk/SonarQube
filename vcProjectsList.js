var projects = require('./repositories.json');
var text = '';
projects.forEach( project => {
//    text += project.key + '\n' ;
    text += project.full_name + '\n' ;
});
var fs = require('fs');
fs.writeFile('mytextfile.txt', text, 'utf8', function(err) {
    if (err) throw err;
    console.log('complete');
    });