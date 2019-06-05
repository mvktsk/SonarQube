
const http = require('http');
var gates = [
  {
    gateName: 'Blue',
    gateId: 0,
    conditions:[] 
  }, 
  {
    gateName:'Green',
    gateId: 0,
    conditions:[]  
  }, 
  {
    gateName:'Orange',
    gateId: 0,
    conditions:[]  
  },
  {
    gateName: 'Red',
    gateId: 0,
    conditions:[]  
  }];

const uri = 'http://localhost:9000/api/qualitygates/show?name=';

gates.forEach( gate => {
    console.log( uri + gate.gateName);
    
    http.get( uri + gate.gateName, (resp) => {
    let data = '';

     // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      conditions = JSON.parse(data).conditions;
      conditions.forEach(condition => {
          gate.conditions.push(condition);
      });
      console.log(gate);
    });
    
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});