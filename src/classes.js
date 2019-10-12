class geoPointData{
    constructor(name, {"latitude":lat, "longitude":lon}, index){
        this.name = name;
        if (lat[lat.length - 1] == 'S') {
            this.lat = '-' + lat.slice(0, lat.length - 1);
        } else {
            this.lat = lat.slice(0, lat.length - 1);
        }
        this.lon = lon;
        this.index = index;
        this.position = {"lat":this.lat, "lon":this.lon}
        this.distances = [];
        this.distanceDict = {}; // {name,lat,lon,index,position}
        if(typeof(classDebug)!= 'undefined'){
            console.debug(this);
        }
    }

}

module.exports = {
    geoPointData
}