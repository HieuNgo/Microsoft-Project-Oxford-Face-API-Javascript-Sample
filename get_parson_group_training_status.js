/**
 * 
 */

var constValues = require('./const/const.js')
	,request = require('request')
	,headers = {
	'Content-Type':'application/json',
	'Ocp-Apim-Subscription-Key':constValues.APIKEY  
}




var options = {
  url: 'https://api.projectoxford.ai/face/v1.0/persongroups/' + constValues.GROUPNAME + '/training',
  method: 'GET',
  headers: headers,
  json:{
	  "name":"sample-group",
	  
  }
 
 
}

//send request
request(options, function (error, response, body) {
  if(error){
	  console.log(error);  
  }
  console.log(body);
  
	
})　　　