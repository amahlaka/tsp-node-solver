var express = require('express');

var vello = require('./src/api.js');
var calc = require('./src/functions.js');
var geoPoint = require('./src/classes.js').geoPointData;
var app = express();
var listOfCities = [];
var seed = '';

app.use(express.static('static'))


app.get('/test',function(req,res,err){
    vello.getCities(function(body){
        api_callback(body,res,req)
    });
})

function api_callback(body,res,req){
    var cityResponse = body.cities;
    for(city in cityResponse){
        var cityEnt = cityResponse[city];
        var tempCity = new geoPoint(cityEnt.name,cityEnt.position,city);
        listOfCities.push(tempCity);
    }
    var sorted = calc.

}




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
 })