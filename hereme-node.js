var express = require('express');
var app     = express();
var router  = express.Router();
var request = require("request");
var bodyParser = require('body-parser');
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1
var day = date.getDate();
if(month < 10){
	month = "0"+month;
}
if(day < 10){
	day = "0"+day;
}

var today = year+""+month+""+day;

var API_KEY = 'FUyJph70P0YW0UHY5Ac9dqg08PRXqSoh05WS2SHPT%2FV0954wS1qpiR%2BdLt1djwmibD2O9QSwx1h%2FrLxEaWv%2FZg%3D%3D';
var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib';

// Index
app.get('/',
  function(req, res, next){
		res.status(200);
	  	res.json({success:true, message: 'success' });
  }
);

app.get('/temp/:nx/:ny',
  function(req, res, next){
	var hour = date.getHours();

	var hours = hour;
	if (hour < 10) {
		hours = '0'+hour;
	}
	
	var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + API_KEY; /* Service Key*/
	queryParams += '&' + encodeURIComponent('base_date') + '=' + today
	queryParams += '&' + encodeURIComponent('base_time') + '=' + hours+'00'
	queryParams += '&' + encodeURIComponent('nx') + '=' + req.params.nx
	queryParams += '&' + encodeURIComponent('ny') + '=' + req.params.ny
	queryParams += '&' + encodeURIComponent('_type') + '=' + 'json'
	console.log('queryParams::',url + queryParams)
	request({
		
		url: url + queryParams,
		method: 'GET'
	}, function (error, response, body) {
		var stringBody = response.body;
		let jsonData = JSON.parse(stringBody);
		
		let resArr = jsonData.response.body.items.item;
		for(var i=0; i<resArr.length; i++){
			if(resArr[i].category === 'T1H'){
				console.log(resArr[i].obsrValue);
				res.status(200);
	  			res.json({success:true, message: 'ok', 'temperature': resArr[i].obsrValue });
			}
		}
		
		
	});
	  
  }
)

var port = 8080;
app.listen(port, function(){
  console.log('listening on port:' + port);
});

module.exports = router;