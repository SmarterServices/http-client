Http-client
===
##Running Tests:
	npm install pm2 -g 
	npm test
##Getting Started:

	npm i @smarterservices/http-client --save
	
##Usage:
	var httpClient = require('http-client');
	
	httpClient(REQUESTOBJECT,function(err,r) {

	Console.log('Results returned here!')
	});
	
The first argument passed to httpClient is a request object

####To find what can be passed in to this object look <a href="https://www.npmjs.com/package/request">Here</a>	

The second argument is the callback for returning the results.

##Configurations

Current version of Http-client supports **Retry**

To change the delay,retry limit or timeout go to config.json in the module folder after installation