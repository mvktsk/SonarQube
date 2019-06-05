const http = require('http');
const uri = 'localhost';
const gateUri = '/api/qualitygates/create?name=';
const conditionUri = '/api/qualitygates/create_condition?gateId=';
const defaultGateUri = '/api/qualitygates/set_as_default?id=';
var gates = [{
        gateName: 'Green',
        gateId: 0,
        conditions: [
          { metric: 'coverage', op: 'LT', warning: '20', error: '' },
          { metric: 'new_coverage', op: 'LT', warning: '20', error: '', period: 1 },
          { metric: 'duplicated_lines_density', op: 'LT', warning: '', error: '10' },
          { metric: 'new_duplicated_lines_density', op: 'LT', warning: '', error: '20', period: 1 },
          { metric: 'sqale_rating', op: 'GT', warning: '1', error: '2' },
          { metric: 'new_maintainability_rating', op: 'GT', warning: '', error: '1', period: 1 },
          { metric: 'reliability_rating', op: 'GT', warning: '1', error: '2' },
          { metric: 'new_reliability_rating', op: 'GT', warning: '', error: '1', period: 1 },
          { metric: 'security_rating', op: 'GT', warning: '1', error: '2' },
          { metric: 'new_security_rating', op: 'GT', warning: '', error: '1', period: 1 },
          { metric: 'test_success_density', op: 'LT', warning: '', error: '90'}
        ]
      },
      {
        gateName: 'Red',
        gateId: 0,
        conditions: [
          { metric: 'coverage', op: 'LT', warning: '', error: '' },
          { metric: 'new_coverage', op: 'LT', warning: '', error: '', period: 1 },
          { metric: 'duplicated_lines_density', op: 'LT', warning: '', error: '25' },
          { metric: 'new_duplicated_lines_density', op: 'LT', warning: '', error: '30', period: 1 },
          { metric: 'sqale_rating', op: 'GT', warning: '1', error: '' },
          { metric: 'new_maintainability_rating', op: 'GT', warning: '', error: '4', period: 1 },
          { metric: 'reliability_rating',  op: 'GT', warning: '1',  error: '' },
          { metric: 'new_reliability_rating', op: 'GT', warning: '',  error: '4', period: 1 },
          { metric: 'security_rating', op: 'GT', warning: '1', error: ''  },
          { metric: 'new_security_rating', op: 'GT', warning: '', error: '4', period: 1 },
          { metric: 'test_success_density', op: 'LT', warning: '', error: '50' }
        ]
      },
      {
        gateName: 'Blue',
        gateId: 0,
        conditions: [
          { metric: 'coverage', op: 'LT', warning: '80', error: '' },
          { metric: 'new_coverage', op: 'LT', warning: '80', error: '', period: 1 },
          { metric: 'duplicated_lines_density', op: 'LT', warning: '', error: '10' },
          { metric: 'new_duplicated_lines_density', op: 'LT', warning: '', error: '10', period: 1 },
          { metric: 'sqale_rating', op: 'GT', warning: '', error: '1' },
          { metric: 'new_maintainability_rating', op: 'GT', warning: '', error: '1', period: 1},
          { metric: 'reliability_rating', op: 'GT', warning: '', error: '1' },
          { metric: 'new_reliability_rating', op: 'GT', warning: '', error: '1', period: 1 },
          { metric: 'security_rating', op: 'GT', warning: '', error: '1' },
          { metric: 'new_security_rating', op: 'GT', warning: '', error: '1', period: 1 },
          { metric: 'test_success_density', op: 'LT', warning: '', error: '90' }
        ]
      },
      {
        gateName: 'Orange',
        gateId: 0,
        conditions: [
          { metric: 'coverage', op: 'LT', warning: '', error: '' },
          { metric: 'new_coverage', op: 'LT', warning: '', error: '', period: 1 },
          { metric: 'duplicated_lines_density', op: 'LT', warning: '', error: '20' },
          { metric: 'new_duplicated_lines_density', op: 'LT', warning: '', error: '25', period: 1 },
          { metric: 'sqale_rating', op: 'GT', warning: '1', error: '3' },
          { metric: 'new_maintainability_rating', op: 'GT', warning: '', error: '2', period: 1 },
          { metric: 'reliability_rating',  op: 'GT',  warning: '1',  error: '3' },
          { metric: 'new_reliability_rating', op: 'GT', warning: '', error: '2', period: 1 },
          { metric: 'security_rating', op: 'GT', warning: '1', error: '3' },
          { metric: 'new_security_rating',  op: 'GT', warning: '', error: '2',  period: 1 },
          { metric: 'test_success_density', op: 'LT', warning: '', error: '70' }
        ]
}];

var options = {
    auth: '',
    hostname: '',
    port: 80,
    path: '/',
    method: 'POST'
};

gates.forEach( gate => {
    
    options.auth = 'admin:admin';
    options.hostname = uri;
    options.port = 9000;
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
        
            if(qualityGate.name === 'Green') {
                setDefaultGate(qualityGate.id)
            };
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
