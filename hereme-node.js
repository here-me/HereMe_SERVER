var express = require('express');
var app     = express();
var router  = express.Router();
var request = require("request");
var bodyParser = require('body-parser');
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1
var day = date.getDate();

let friendInfo = [];
var tempId = 0;

if(month < 10){
	month = "0"+month;
}
if(day < 10){
	day = "0"+day;
}

let today = year+""+month+""+day;

const API_KEY = 'FUyJph70P0YW0UHY5Ac9dqg08PRXqSoh05WS2SHPT%2FV0954wS1qpiR%2BdLt1djwmibD2O9QSwx1h%2FrLxEaWv%2FZg%3D%3D';
var BASE_URL = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib';

// Index
app.get('/',
  function(req, res, next){
		res.status(200);
	  	res.json({success:true, message: 'success' });
  }
);

app.get('/index*',
  function(req, res, next){
		res.status(200);
	  	res.json({success:true, message: 'success' });
  }
);

app.get('/temp/:nx/:ny',
  function(req, res, next){
	  console.log(req.params.nx)
	  console.log(req.params.ny)

	let url = makeUrl(req, res, req.params.nx, req.params.ny);
	request({
		url: queryParams,
		method: 'GET'
	}, function (error, response, body) {
		let stringBody = response.body;
		let jsonData = JSON.parse(stringBody);
		
		let resArr = jsonData.response.body.items.item;
		if(resArr !== undefined) {
			for(var i=0; i<resArr.length; i++){
				if(resArr[i].category === 'T1H'){
					res.status(200);
					res.json({success:true, message: 'ok', 'temperature': resArr[i].obsrValue });
				}
			}	
		} else {
			res.status(200);
			res.json({success:true, message: 'ok', 'temperature': 0 });
		}
	});
  }
);

// app.post('/addfriend', 
// function(req, res, next){
	
// });

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'heredb.cuaqc0x9rrn0.ap-northeast-2.rds.amazonaws.com',
  user     : 'sjkim',
  password : 'awsdatabase!0',
  database : 'hereme'
});

app.get('/friendsh',
function(req, res, next){
	connection.connect();
	connection.query('SELECT * from friends', function (error, results, fields) {
		if (error) throw error;
	
		for(var l=0; l<results.length; l++){
			// console.log(results[l].x)
			let reUrl = makeUrl(results[l].x, results[l].y);
			tempId = results[l].id
			request({
				url: reUrl,
				method: 'GET'
			}, function (error, response, body) {
				let stringBody = response.body;
				let jsonData = JSON.parse(stringBody);
				
				if(jsonData.response.body !== undefined) {
					let resArr = jsonData.response.body.items.item;
					
					if(resArr !== undefined) {
						for(var i=0; i<resArr.length; i++){
							// 현재 기온
							if(resArr[i].category === 'T1H'){
								friendInfo.push({'temp': resArr[i].obsrValue})
								next;
							} else if(resArr[i].category === 'RN1'){ // 1시간 강수량
								friendInfo.push({'rain': resArr[i].obsrValue})
								next;
							}else if(resArr[i].category === 'REH'){ // 습도
								friendInfo.push({'hum': resArr[i].obsrValue})
								next;
							}
						}				
					} else {
						friendInfo = {'temp':0}
					}
					console.log('화이팅...', friendInfo)
					res.status(200);
					res.json({success:true, message: 'ok', 'friends': friendInfo });
					
				}
			});
		}
		// console.log('last arr', friendInfo)
	});
	
	connection.end();
});

var port = 80;
app.listen(port, function(){
  console.log('listening on port:' + port);
});


function makeUrl(xloc, yloc, req, res, ) {
	var hour = date.getHours();

	var hours = hour;
	if (hour < 10) {
		hours = '0'+hour;
	}

	var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + API_KEY; /* Service Key*/
	queryParams += '&' + encodeURIComponent('base_date') + '=' + today
	queryParams += '&' + encodeURIComponent('base_time') + '=' + hours+'00'
	queryParams += '&' + encodeURIComponent('nx') + '=' + xloc
	queryParams += '&' + encodeURIComponent('ny') + '=' + yloc
	queryParams += '&' + encodeURIComponent('_type') + '=' + 'json'
	
	// console.log(BASE_URL+queryParams);
	return BASE_URL+queryParams;
}
module.exports = router;



