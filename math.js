var request = require('request');
var geolib = require('geolib');
var GeoJSON = require('geojson');
var express = require('express');

var app = express();

app.use(express.static('static'))
app.get('/test', function(req, res){
    sit_handler(req,res);
  });

function sit_handler(req, res1){
    request('https://api-staging.vello.fi/nutcracker/task', {json:true}, function(err,res,body){
        callback(err,res,body,res1,req);
    });

}
function callback(err, res, body,res1,req){
    var glist=[]
    var origin={}
    if (err) { return console.log(err); 
    }
    console.log(body)
    for(var city in body.cities){
        var lat = body.cities[city].position.latitude
            if (lat[lat.length-1]=='S'){
                lat = '-' + lat.slice(0,lat.length-1);
            }
            else{
                lat = lat.slice(0,lat.length-1);
            }
        if(city==0){
            
            origin = {"latitude":lat, "longitude":body.cities[city].position.longitude,"name":body.cities[city].name};
        }

        glist.push({"latitude":lat, "longitude":body.cities[city].position.longitude, "name":body.cities[city].name});
    }
    var sorted = geolib.orderByDistance(origin,glist);
    sorted.push(origin);
    console.log(sorted);
    var path = geolib.getPathLength(sorted);
    
    var geojson = GeoJSON.parse(sorted, {Point: ['latitude', 'longitude']});
    res1.json(geojson);
    var cityOrder = []
    for(x in sorted){
        cityOrder.push(sorted[x].name)
    }
    console.log(cityOrder);
    console.log(path);
    var seed=body.seed
    //console.log(seed)
    sendData(path,cityOrder,seed);
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
 })



 function sendData(distance,order,seed){
    request.post('https://api-staging.vello.fi/nutcracker/return-task',{
        json:{ "path":order,
        "distance":distance,
        "email":"arttu.mahlakaarto@gmail.com",
        "seed":seed
        }
    }, (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        console.log(`statusCode: ${res.statusCode}`)
        console.log(body)
      });
 }