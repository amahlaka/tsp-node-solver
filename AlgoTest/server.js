
var geolib = require('geolib');
var GeoJSON = require('geojson');
import { Graph } from 'graphs-adt';
const g = new Graph();


for(point in listOfPoints){
    var city = listOfPoints[point].name
    g.addNode(city);
}



for(point in listOfPoints){
    var city = listOfPoints[point].name
    g.addNode(city);
    for(otherPoint in listOfPoints){
        if(point != otherPoint){
            var otherCity = listOfPoints[otherPoint].name
            var dist = geolib.getDistance(listOfPoints[point],listOfPoints[otherPoint]);
            g.addEdge(city,otherCity,dist);
        }
    }
}