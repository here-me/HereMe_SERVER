var express = require('express');
var app     = express();
var router  = express.Router();
var request = require("request");
var bodyParser = require('body-parser');
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth()+1
var day = date.getDate();
var hour = date.getHours();

var hours = '';
if (hour < 10) {
	hours = '0'+hour;
}



if(month < 10){
	month = "0"+month;
}
if(day < 10){
	day = "0"+day;
}

var today = year+""+month+""+day;

console.log('today!!!!!z	',today)
console.log('hours', hour)

var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=37.52&lon=127&units=metric&appid=a0094dc08d23f6c30af994855c039e73';

var baseURL = 'http://api.openweathermap.org/data/2.5/weather';

var API_KEY = 'FUyJph70P0YW0UHY5Ac9dqg08PRXqSoh05WS2SHPT%2FV0954wS1qpiR%2BdLt1djwmibD2O9QSwx1h%2FrLxEaWv%2FZg%3D%3D';
var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastTimeData';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + API_KEY; /* Service Key*/
queryParams += '&' + encodeURIComponent('base_date') + '=' + today
queryParams += '&' + encodeURIComponent('base_time') + '=' + hours+'00'
queryParams += '&' + encodeURIComponent('nx') + '=' + '61'
queryParams += '&' + encodeURIComponent('ny') + '=' + '125'
queryParams += '&' + encodeURIComponent('_type') + '=' + 'json'


// default data is seoul
var lat = '37.5667'; // 위도
var lon = '126.9783'; // 경도

var testUrl = baseURL + '' + lat + 

// Index
app.get('/',
  function(req, res, next){
	request({
		url: url + queryParams,
		method: 'GET'
	}, function (error, response, body) {
		var jsonBody = response.body;
		
		res.status(200);
	  	res.json({success:true, message: 'data', 'body': JSON.parse(jsonBody) });
	});
  }
);

app.get('/isHot/:nx/:ny',
  function(req, res, next){

	var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + API_KEY; /* Service Key*/
	queryParams += '&' + encodeURIComponent('base_date') + '=' + today
	queryParams += '&' + encodeURIComponent('base_time') + '=' + hours+'00'
	queryParams += '&' + encodeURIComponent('nx') + '=' + req.params.nx
	queryParams += '&' + encodeURIComponent('ny') + '=' + req.params.ny
	queryParams += '&' + encodeURIComponent('_type') + '=' + 'json'
	request({
		
		url: url + queryParams,
		method: 'GET'
	}, function (error, response, body) {
		var jsonBody = response.body;
		
		res.status(200);
	  	res.json({success:true, message: 'data', 'body': JSON.parse(jsonBody) });
	});
	  
  }
)

var port = 80;
app.listen(port, function(){
  console.log('listening on port:' + port);
});


// // Show
// router.get('/:id',
//   function(req, res, next){
//     Hero.findOne({id:req.params.id})
//     .exec(function(err, hero){
//       if(err) {
//         res.status(500);
//         res.json({success:false, message:err});
//       }
//       else if(!hero){
//         res.json({success:false, message:"hero not found"});
//       }
//       else {
//         res.json({success:true, data:hero});
//       }
//     });
//   }
// );

// // Create
// router.post('/',
//   function(req, res, next){
//     Hero.findOne({})
//     .sort({id: -1})
//     .exec(function(err, hero){
//       if(err) {
//         res.status(500);
//         return res.json({success:false, message:err});
//       }
//       else {
//         res.locals.lastId = hero?hero.id:0;
//         next();
//       }
//     });
//   },
//   function(req, res, next){
//     var newHero = new Hero(req.body);
//     newHero.id = res.locals.lastId + 1;
//     newHero.save(function(err, hero){
//       if(err) {
//         res.status(500);
//         res.json({success:false, message:err});
//       }
//       else {
//         res.json({success:true, data:hero});
//       }
//     });
//   }
// );

// // Update
// router.put('/:id',
//   function(req, res, next){
//     Hero.findOneAndUpdate({id:req.params.id}, req.body)
//     .exec(function(err, hero){
//       if(err) {
//         res.status(500);
//         res.json({success:false, message:err});
//       }
//       else if(!hero){
//         res.json({success:false, message:"hero not found"});
//       }
//       else {
//         res.json({success:true});
//       }
//     });
//   }
// );

// // Destroy
// router.delete('/:id',
//   function(req, res, next){
//     Hero.findOneAndRemove({id:req.params.id})
//     .exec(function(err, hero){
//       if(err) {
//         res.status(500);
//         res.json({success:false, message:err});
//       }
//       else if(!hero){
//         res.json({success:false, message:"hero not found"});
//       }
//       else {
//         res.json({success:true});
//       }
//     });
//   }
// );

module.exports = router;