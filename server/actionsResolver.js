// nconf
var nconf = require('nconf');
nconf.argv().env().file('./config.json');

function resolveParametersFor(action, actor) {
   console.log('Resolving for: ' + action + ' ' + actor);
   
   var result = nconf.get(actor+action); 

   console.log('Result: ' + result);

    if(actor == 'lights')
    {
        if(action == 'switchOn')
            {
                return "13988876";
            }
            
            if(action == 'switchOff')
            {
                return "13988867";
            }
    }
    else 
    {
        return "";
    }
}

module.exports = {
    resolveParametersFor: function (action, actor) {
        return resolveParametersFor(action, actor);
    }
};