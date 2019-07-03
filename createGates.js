const http = require('https');
const uri = 'sonar.virtocommerce.com';
const gateUri = '/api/qualitygates/create?name=';
const conditionUri = '/api/qualitygates/create_condition?gateId=';
const defaultGateUri = '/api/qualitygates/set_as_default?id=';
var gates = require('./gates.json');

var options = {
    auth: 'admin:admin',
    hostname: uri,
    port: 443,
    path: '/',
    method: 'POST'
};

gates.forEach( gate => {
    
    options.path = gateUri + gate.gateName;
    
    gatePostRequest = http.request( options, (resp) => {
        let data = '';
            
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. 
        resp.on('end', () => {
            qualityGate = JSON.parse(data)
        
            gate.gateId = qualityGate.id;
        
            createGateConditions (gate);
        
//            if(qualityGate.name === 'Green') {
//                setDefaultGate(qualityGate.id)
//            };
        });
    });

    gatePostRequest.on("error", (err) => {
        console.log("Error: " + err.message);
    });

    gatePostRequest.end();
    
    function createGateConditions (gate){
        gate.conditions.forEach( condition => {
            options.path = createGateConditionUri (gate.gateId, condition);
            
            conditionPostRequest = http.request(options);
            
            conditionPostRequest.on("error", (err) => {
                console.log("Error: " + err.message);
            });
            conditionPostRequest.end();
        });
    };

    function setDefaultGate (gateId){
        options.path = defaultGateUri + gateId;
        
        defaultGatePostRequest = http.request(options);
        
        defaultGatePostRequest.on("error", (err) => {
            console.log("Error: " + err.message);
        });
        defaultGatePostRequest.end();
    }

    function createGateConditionUri (gateId, condition){
        var outputUri = conditionUri + gateId;
        outputUri += '&metric=' + condition.metric;
        
        if (typeof condition.op !== 'undefined') {
            outputUri += '&op=' + condition.op;
        }
        if (typeof condition.warning !== 'undefined') {
            outputUri += '&warning=' + condition.warning;
        }
        if (typeof condition.error !== 'undefined') {
            outputUri += '&error=' + condition.error;
        }
        if (typeof condition.period !== 'undefined') {
            outputUri += '&period=' + condition.period;
        }
        return outputUri;
    };
})
