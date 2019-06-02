var express = require('express');
var app     = express();
var router  = express.Router();
var request = require("request");
var bodyParser = require('body-parser');
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1
var day = date.getDate();
var mysql      = require('mysql');

let friendInfo = [];
var tempId = 0;
var pool  = mysql.createPool({
	connectionLimit : 10,
	host     : 'heredb.cuaqc0x9rrn0.ap-northeast-2.rds.amazonaws.com',
	user     : 'sjkim',
	password : 'awsdatabase!0',
	database : 'hereme'
});

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
		let url = makeUrl(req, res, req.params.nx, req.params.ny);
		let reUrl = makeUrl(req.params.nx, req.params.ny);
		request({
			url: reUrl,
			method: 'GET'
		}, function (error, response, body) {
			let stringBody = response.body;
			let jsonData = JSON.parse(stringBody);
			console.log(jsonData.response.body);
			if(jsonData.response.body !== undefined) {
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



app.get('/friends',
function(req, res, next){
	
	pool.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		connection.query('SELECT * from friends', function (error, results, fields) {
			if (error) throw error;
			friendInfo = [];
			for(var l=0; l<results.length; l++){
				// 이름, 온도 강수 확률, 습도, 지역, 맑음 여부
				//
				let reUrl = makeUrl(results[l].x, results[l].y);
				tempId = results[l].id
				let person = { 
					id: results[l].id, 
					name: results[l].name, 
					temp: results[l].temp, 
					humi: results[l].humi, 
					rain: results[l].rain, 
					locate_name: results[l].locate_name, 
					image_url: results[l].image_url,
					isGood: results[l].status,
					image_status: results[l].image_status
				}
				friendInfo.push(person);
				// TODO
				// 추후 기상청 데이터에서 기상정보로 처리 필요.
			}
			res.status(200);
			res.json({success:true, message: 'ok', 'friends': friendInfo });
			console.log('last arr', friendInfo);
		});
	});
	
	
});

var port = 8080;
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



