var request = require('request');
var geolib = require('geolib');
var GeoJSON = require('geojson');
var solver = require('node-tspsolver');

class geoPointData{
    constructor(name, lat, long, index){
        this.name = name;
        this.lat = lat;
        this.long = long;
        this.index = index;
        this.costMatrix = [];
        this.nameMatrix = []
    }
    appendMatrix(index,cost,name){
            this.costMatrix.push(cost);
            this.nameMatrix.push({"name":name,"distance":cost})
    }

}




function fetchData(){
    request('https://api-staging.vello.fi/nutcracker/task', {json:true}, parse);
}

var seed='';
function parse(err, res, body) {
    var cityList = [];
    if (err) {
        return console.log(err);
    }
    seed=body.seed;
    var citys = body.cities;
    for (var entry in citys) {
        var cityName = citys[entry].name;
        var lat = citys[entry].position.latitude;
        var latitude;
        if (lat[lat.length - 1] == 'S') {
            latitude = '-' + lat.slice(0, lat.length - 1);
        } else {
            latitude = lat.slice(0, lat.length - 1);
        }
        var longitude = citys[entry].position.longitude;
        var tempCity = new geoPointData(cityName,latitude,longitude,entry);
        cityList.push(tempCity);
    }
    createMatrix(cityList);
}

function  createMatrix(citylist){
    for(entry in citylist){
        var index1 = citylist[entry].index;
        var location1 = {"lat":citylist[entry].lat, "lon":citylist[entry].long};

        for(entry2 in citylist){
            var index2 = citylist[entry2].index;
            var location2 = {"lat":citylist[entry2].lat, "lon":citylist[entry2].long};
            var dist = geolib.getDistance(location1,location2,0.1);
            if(index1 == index2){
                dist=0;
            }
            citylist[entry].appendMatrix(index2,dist,citylist[entry2].name);
            console.log("Distance between "+ citylist[entry].name + " and " + citylist[entry2].name + " is: " + dist + " Meters")
        }
    }
    getMatrix(citylist);
}

function getMatrix(citylist){
    var optimalPath = [];
    var pathCoords = [];
    var matrix = [];
    for(entry in citylist){
        matrix.push(citylist[entry].costMatrix);
    }
    solver.solveTsp(matrix, true, {'N':60000000, 'reheatInterval':500, 'T':90}).then(function (result) {
        console.log(result)
        for(var point in result){
            var pointName = citylist[result[point]].name;
            optimalPath.push(pointName);
            var cityLoc =  {"lat":citylist[result[point]].lat,"lon":citylist[result[point]].long};
            pathCoords.push(cityLoc);
            console.log(cityLoc);
        }
        var optimalLength = geolib.getPathLength(pathCoords,function(point,dest){
            return geolib.getDistance(point,dest,0.1);
        });
        console.log("The Following path: ");
        console.log(optimalPath);
        console.log('has a length of:');
        console.log(optimalLength);
        sendData(optimalLength,optimalPath);
    })

}

fetchData();


function sendData(distance,order){
    var json={ "path":order,
    "distance":distance,
    "email":"arttu.mahlakaarto@gmail.com",
    "seed":seed
    }
    console.log(json);
    request.post('https://api-staging.vello.fi/nutcracker/return-task',{
        json:json
    }, (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        console.log(`statusCode: ${res.statusCode}`)
        console.log(body)
        console.log()
      }); 
 }



