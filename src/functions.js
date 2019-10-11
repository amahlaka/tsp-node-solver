var geolib = require('geolib');
var solver = require('node-tspsolver');


function calculateAllDistances(listOfMapPoints){
    for(var pointIndex in listOfMapPoints){
        var mapPoint = listOfMapPoints[pointIndex];
        var startLocation = mapPoint.position;
        var cityIndex = mapPoint.cityIndex;

        for(var secondaryPointIndex in listOfMapPoints){
            var secondaryMapPoint = listOfMapPoints[secondaryPointIndex];
            var secondaryCityIndex = secondaryMapPoint.index;
            var cityName = secondaryMapPoint.name;
            var endLocation = secondaryMapPoint.position;
            if(cityIndex==secondaryCityIndex){
                circleDistance=0;
            }
            else{
                var circleDistance = getDistance(startLocation,endLocation);
            }
            mapPoint.distances.push(circleDistance);
            mapPoint.distanceDict[String(cityName)] = circleDistance;
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

function calculatePath(path,listOfMapPoints){
    var totalDistance = 0;
    for(var waypoint in path){
        var waypointIndex = path[waypoint];
        var mapPoint = listOfMapPoints[waypointIndex];
        var nextPoint = listOfMapPoints[path[Number(waypoint)+1]]
        var distance = getDistance(mapPoint.position,nextPoint.position)
        totalDistance = totalDistance+distance;
        if(Number(path[Number(waypoint)+1]) == Number(listOfMapPoints.length)-1){
            break;
        }
    }
    console.log(totalDistance);



}