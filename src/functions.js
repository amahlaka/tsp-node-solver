var geolib = require('geolib');
var solver = require('node-tspsolver');


function calculateAllDistances(listOfMapPoints){
    for(var pointIndex in listOfMapPoints){
        var mapPoint = listOfMapPoints[pointIndex];
        var startLocation = mapPoint.position;
        var cityIndex = mapPoint.cityIndex;

        for(var secondaryPointIndex in listOfMapPoints){
            var secondaryMapPoint = listOfMapPoints[secondaryPointIndex];
            var endLocation = secondaryMapPoint.position;
            var circleDistance = getDistance(startLocation,endLocation);
            
        }
    }

}


function getDistance({"lat":lat1,"lon":lon1},{"lat":lat2,"lon":lon2}) {
    var r = 6378137;
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lon2 *= Math.PI / 180;
    var lonDelta = lon2 - lon1;
    var a = Math.pow(Math.cos(lat2) * Math.sin(lonDelta) , 2) + Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDelta) , 2);
    var b = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lonDelta);
    var angle = Math.atan2(Math.sqrt(a) , b);
    
    return angle * r;
}