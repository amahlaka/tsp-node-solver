var express = require('express');
var solver = require('node-tspsolver');
var vello = require('./src/api.js');
var calc = require('./src/functions.js');
var geoPoint = require('./src/classes.js').geoPointData;
var listOfCities = [];
var seed = '';
var dbg = true;
const fs = require('fs');
if(dbg){
    var body = JSON.parse(fs.readFileSync('./temp.json'));
    api_callback(body);
}
else{
vello.getCities(function(body){
    api_callback(body)
});
}
async function api_callback(body){
    seed=body.seed;
    var cityResponse = body.cities;
    for(var city in cityResponse){
        var cityEnt = cityResponse[city];
        var tempCity = new geoPoint(cityEnt.name,cityEnt.position,city);
        listOfCities.push(tempCity);
    }
    var sorted = calc.calculateAllDistances(listOfCities);
    var distanceMatrix =[];
    for(var city in listOfCities){
        distanceMatrix.push(listOfCities[city].distances)
    }
    //console.log(distanceMatrix);
    var solutionList = [];
    var shortestPath =[];
    var lowest=999999999999999;
    var current;
    var StartTime = Date.now();
    for(var c=0; c < 5; c++){
        var solveTime = Date.now();
    var solution = await solver.solveTsp(distanceMatrix, true, {'N':60000000, 'lambda':0.5}).then(function (result) {
        //console.log(result)
        var cityNames=[]
        for(var index in result){
            var indexNumber = result[index];
            var city = listOfCities[indexNumber];
            cityNames.push(city.name);
            
        }
        var totalDistance = calc.altPath(result,listOfCities);
        console.log(c);
        console.log(cityNames);
        console.log(totalDistance);
        current=totalDistance;
        if(current < lowest){
            console.log(String(current) + " is shorter than "+ String(lowest));
            lowest=current;
            shortestPath=cityNames;
        }
        solutionList.push([{"distance":totalDistance,"path":cityNames}]);
        var solveEnd = Date.now() - solveTime;
        console.log("Time Elapsed: " + Math.floor(solveEnd/1000)+ "s");

    })
}
var EndTime = Date.now();
var diff = EndTime - StartTime;
var sec =  Math.floor(diff/1000);
console.log("Time Elapsed: " + sec + "s");
if(sec < 120){
    console.log("Final solution:")
    console.log(shortestPath)
    console.log("Is: "+ lowest + " Meters long");
    vello.postResponse(shortestPath,lowest,"arttu.mahlakaarto@gmail.com", seed);
}
}


