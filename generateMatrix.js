var request = require('request');
var geolib = require('geolib');
var GeoJSON = require('geojson');

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


function parse(err, res, body) {
    var cityList = [];
    if (err) {
        return console.log(err);
    }
    var cities = body.cities;
    for (var entry in cities) {
        var name = cities[entry];
        var lat = cities[entry].position.latitude;
        var latitude;
        if (lat[lat.length - 1] == 'S') {
            latitude = '-' + lat.slice(0, lat.length - 1);
        } else {
            latitude = lat.slice(0, lat.length - 1);
        }
        var longitude = cities[entry].position.longitude;
        var tempCity = new geoPointData(name,latitude,longitude,entry);
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
            var dist = geolib.getDistance(location1,location2);
            citylist[entry].appendMatrix(index2,dist,citylist[entry2].name);
            console.log("Distance between "+ citylist[entry].name + " and " + citylist[entry2].name + " is: " + dist + " Meters")
        }
    }
    getMatrix(citylist);
}

function getMatrix(citylist){
    var matrix = [];
    for(entry in citylist){
        matrix.push(citylist[entry].costMatrix);
    }
    console.log(matrix);
}

fetchData();